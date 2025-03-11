import { z } from "zod";

export const classificationSchema = z.object({
  title: z.string().optional().describe("A suitable seo friendly title"),
  shortDescription: z
    .string()
    .describe(
      "A short description of the product/apparel. This should be a concise description of the product and contains SEO friendly keywords.",
    ),
  description: z
    .string()
    .describe(
      "A detailed description of the product/apparel along with the person wearing that apparel,\n" +
        "details about apparel like pockets,color,pattern,prints or if there are some text written or more details too.",
    ),
  genderGroup: z
    .enum(["women", "men", "boy", "girl"])
    .describe("The gender group for which the product is intended."),
  itemType: z.string().describe("The type or category of the item."),
  wearType: z
    .string()
    .describe(
      "The wear type or style of the item.,e.g. upper_body,full_body,single piece,lower_body,innerwear,etc",
    ),
  specifications: z
    .object({
      fit: z.string().optional().describe("Fit of the item, e.g., Slim Fit."),
      length: z
        .string()
        .optional()
        .describe("Length of the item, e.g., Regular,loose,etc."),
      mainTrend: z
        .string()
        .optional()
        .describe(
          "Main trend associated with the item, e.g., Tropical,denim,old money,etc.",
        ),
      neck: z
        .string()
        .optional()
        .describe("Neck style of the item, e.g., Round Neck,etc."),
      occasion: z
        .string()
        .optional()
        .describe(
          "Occasion for which the item is suitable, e.g., Casual,formal,street-wear,etc.",
        ),
      pattern: z
        .string()
        .optional()
        .describe("Pattern of the item, e.g., Printed,plain,etc."),
      patternCoverage: z
        .string()
        .optional()
        .describe(
          "Pattern coverage of the item, e.g., All-Over,center/chest, left chest,back etc.",
        ),
      // Add more fields as necessary
    })
    .optional(),
  dominantColor: z
    .string()
    .describe(
      "The dominant color of the cloth or fabric in the image in HEX format.",
    ),
  colorPalette: z
    .array(z.string())
    .describe(
      "An array of prominent colors of cloth or fabric in the image in HEX format.",
    ),
  tags: z
    .array(z.string())
    .describe("An array of tags or keywords associated with the item."),
  occasions: z
    .array(z.string())
    .describe("An array of occasions for which the item is suitable."),
  seasons: z
    .array(z.string())
    .describe(
      "An array of seasons/weather/environment for which the item is suitable.",
    ),
  // Add more fields as necessary
});

export const rawProductSchema = z.object({
  images: z.array(
    z.object({
      url: z.string().describe("The URL of the image."),
      alt: z.string().optional().describe("The alt text of the image."),
    }),
  ),
  title: z.string().min(5).describe("The title of the product."),
  description: z.string().min(5).describe("The description of the product."),
  productUrl: z.string().url().describe("The URL of the product page."),
  price: z.object({
    currency: z.string().describe("The currency of the price."),
    value: z.coerce.number().describe("The value of the price."),
  }),
  brand: z.string().describe("The brand of the product."),
  variants: z.object({
    size: z
      .array(z.string())
      .describe("An array of sizes available for the product."),
    // color:z.array(z.string()).describe("An array of colors available for the product."),
  }),
  markupMetadata: z.object({
    sku: z.string().describe("The SKU of the product."),
    // Add more fields as necessary
  }),
});

export const productSchema = z.object({
  ...rawProductSchema.shape,
  ...classificationSchema.shape,
});
