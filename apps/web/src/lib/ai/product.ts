import { type CoreMessage, embed, generateObject } from "ai";
import { vertex } from "./model";
import {classificationSchema} from "~/constants/product"

export async function classifyImageToObject(imageUrls: string[]) {

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
    schema:classificationSchema,
  });

  return result;
}



const imageUrl =
  "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/2024/SEPTEMBER/7/VouyYW4N_3ad45252456a4958acd9ee91ab64942d.jpg";
// const productAttributes = await classifyImageToObject([imageUrl]);

// console.dir(productAttributes.object, { depth: null });
