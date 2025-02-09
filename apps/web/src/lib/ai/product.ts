import { type CoreMessage, embed, generateObject } from "ai";
import { z } from "zod";
import { vertex } from "./model";

export async function classifyImageToObject(imageUrls: string[]) {
  const schema = z.object({
    description: z
      .string()
      .describe(
        "A detailed description of the product/apparel along with the person wearing that.",
      ),
    gender: z
      // .string()
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
          .describe("Length of the item, e.g., Regular."),
        mainTrend: z
          .string()
          .optional()
          .describe("Main trend associated with the item, e.g., Tropical."),
        neck: z
          .string()
          .optional()
          .describe("Neck style of the item, e.g., Round Neck."),
        occasion: z
          .string()
          .optional()
          .describe("Occasion for which the item is suitable, e.g., Casual."),
        pattern: z
          .string()
          .optional()
          .describe("Pattern of the item, e.g., Printed,plain,etc."),
        patternCoverage: z
          .string()
          .optional()
          .describe("Pattern coverage of the item, e.g., All-Over."),
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
    // Add more fields as necessary
  });

  const prompt: Array<CoreMessage> = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Classify the following product image and provide detailed attributes, including specifications and color information:",
        },
        ...(imageUrls.map((url) => ({
          type: "image",
          image: new URL(url),
        })) as { type: "image"; image: URL }[]),
      ],
    },
  ];

  const result = await generateObject({
    model: vertex("gemini-2.0-flash-001"),
    messages: prompt,
    schema,
  });

  return result;
}

export async function generateObjectEmbeddings(
  object: Record<string, unknown>,
) {
  const result = await embed({
    model: vertex.textEmbeddingModel("text-embedding-004"),
    value: JSON.stringify(object),
    maxRetries: 0, // Disable retries
  });
  const { embedding } = result;
  return embedding;
}

const imageUrl =
  "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/2024/SEPTEMBER/7/VouyYW4N_3ad45252456a4958acd9ee91ab64942d.jpg";
const productAttributes = await classifyImageToObject([imageUrl]);

console.dir(productAttributes.object, { depth: null });
const productEmbeddings = await generateObjectEmbeddings(
  productAttributes.object,
);
console.log(productEmbeddings);
