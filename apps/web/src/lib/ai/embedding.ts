import { type CoreMessage, embed, generateObject } from "ai";
import { vertex } from "./model";


export async function generateObjectEmbeddings(
    object: Record<string, unknown>,
  ) {
    const result = await embed({
      model: vertex.textEmbeddingModel("text-embedding-004"),
      value: JSON.stringify(object),
      maxRetries: 1, // Disable retries
    });
    const { embedding } = result;
    return embedding;
  }
export async function generateTextEmbeddings(
    query: string,
  ) {
    const result = await embed({
      model: vertex.textEmbeddingModel("text-embedding-004"),
      value: query,
      maxRetries: 0, // Disable retries
    });
    const { embedding } = result;
    return embedding;
  }