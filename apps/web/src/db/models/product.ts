import mongoose, { Schema, Document, model } from "mongoose";

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

    // Embedding for Vector Search
    text_embeddings: number[];
}

export interface ProductJson extends Omit<RawProduct,"text_embeddings">{
    _id:string,
    similarityScore:number,
}

export interface IProduct extends RawProduct,Document{}


// Mongoose Schema Definition
const ProductSchema = new Schema<IProduct>({
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
    colorPalette: { type: [String], required: true },
    tags: { type: [String], required: true },
    occasions: { type: [String], required: true },

    // Embedding for Vector Search
    text_embeddings: { type: [Number], required: true, index: "2dsphere" }, // Index for vector search
});

// Create and export the model
const Product = mongoose?.models?.Product || model<IProduct>("Product", ProductSchema);

export default Product;
