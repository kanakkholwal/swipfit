import mongoose, { Schema, type Document, model } from "mongoose";

// Interface for the Product Document
export interface RawProduct {
    images: { url: string; alt?: string }[];
    title: string;
    description: string;
    productUrl: string;
    price: { currency: string; value: number };
    brand: string;
    variants: { size: string[] };
    markupMetadata: { sku: string };

    // Classification Fields
    shortDescription: string;
    genderGroup: "women" | "men" | "boy" | "girl";
    itemType: string;
    wearType: string;
    specifications?: {
        fit?: string;
        length?: string;
        mainTrend?: string;
        neck?: string;
        occasion?: string;
        pattern?: string;
        patternCoverage?: string;
    };
    dominantColor: string;
    colorPalette: string[];
    tags: string[];
    occasions: string[];
    seasons: string[];

    likes: number;
    // likes: string[];

    // Embedding for Vector Search
    text_embeddings: number[];
}

export interface ProductJson extends Omit<RawProduct,"text_embeddings">{
    _id:string,
    slug: string;
    similarityScore:number,
    likes: number;
    // likes: string[];

}

export interface IProduct extends RawProduct,Document{
    slug: string;
    like: (userId: string) => Promise<void>;
    unlike: (userId: string) => Promise<void>;
}


// Mongoose Schema Definition
const ProductSchema = new Schema<IProduct>({
    slug: { type: String, required: true, unique: true },
    images: [{ url: String, alt: String }],
    title: { type: String, required: true, minlength: 5 },
    description: { type: String, required: true, minlength: 5 },
    productUrl: { type: String, required: true },
    price: { currency: String, value: Number },
    brand: { type: String, required: true },
    variants: {
        size: [String],
    },
    markupMetadata: {
        sku: { type: String, required: false },
    },

    // Classification Fields
    shortDescription: { type: String, required: true },
    genderGroup: { type: String, enum: ["women", "men", "boy", "girl"], required: true },
    itemType: { type: String, required: true },
    wearType: { type: String, required: true },
    specifications: {
        fit: String,
        length: String,
        mainTrend: String,
        neck: String,
        occasion: String,
        pattern: String,
        patternCoverage: String,
    },
    dominantColor: { type: String, required: true },
    colorPalette: { type: [String], required: true, default:[]  },
    tags: { type: [String], required: true, default:[]  },
    occasions: { type: [String], required: true, default:[]  },
    seasons: { type: [String], default:[] },
    
    likes: { type: Number, default: 0 }, // Stores total likes count
    // likes: { type: [String], default: [] },

    // Embedding for Vector Search
    text_embeddings: { type: [Number], required: true, index: "2dsphere" }, // Index for vector search
});



export interface IProductLike extends Document {
    userId:string;
    productId:string;
}

const ProductLikeSchema = new mongoose.Schema<IProductLike>({
    userId: { type: String, required: true },
    productId: { type: String, required: true },
}, { timestamps: true });

export const ProductLike = mongoose?.models?.ProductLike || mongoose.model("ProductLike", ProductLikeSchema);


export interface IProductSearchQuery extends Document {
    query: string;
    embeddings: number[];
    product_results : string[];
}

const ProductSearchQuerySchema = new mongoose.Schema<IProductSearchQuery>({
    query: { type: String, required: true },
    embeddings: { type: [Number], required: true },
    product_results: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
}, { timestamps: true });

export const ProductSearchQuery = mongoose
    ?.models?.ProductSearchQuery || mongoose.model("ProductSearchQuery", ProductSearchQuerySchema);



// 📌 **Instance Method: Like a Product**
ProductSchema.methods.like = async function (userId: string) {
    const existingLike = await ProductLike.findOne({ userId, productId: this._id });

    if (!existingLike) {
        await ProductLike.create({ userId, productId: this._id });
        this.likes += 1;
        await this.save();
    }
};

// 📌 **Instance Method: Unlike a Product**
ProductSchema.methods.unlike = async function (userId: string) {
    const existingLike = await ProductLike.findOneAndDelete({ userId, productId: this._id });

    if (existingLike) {
        this.likes -= 1;
        await this.save();
    }
};


// Create and export the model
const Product = mongoose?.models?.Product || model<IProduct>("Product", ProductSchema);

export default Product;
