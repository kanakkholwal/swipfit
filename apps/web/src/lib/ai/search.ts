import { embed } from "ai";
import { vertex } from "./model";

// embed search query and get the results
export async function embedSearchQuery(query: string) {
  const { embedding } = await embed({
    model: vertex.textEmbeddingModel("text-embedding-004"),
    value: query,
    maxRetries: 1,
  });
  return embedding;
}
