import { pinecone, pineconeIndex, model } from "~/db/connect.pc";
// import { generateTextEmbeddings } from "./embedding";

export async function semanticSearch(query: string) {
  const queryEmbedding = await pinecone.inference.embed(
    model,
    query.split(`",`),
    { inputType: "query", vectorType: "dense" },
  );

  const result = await pineconeIndex.query({
    vector:
      queryEmbedding.data[0].vectorType === "dense"
        ? queryEmbedding.data[0].values
        : [],
    topK: 5,
    includeMetadata: true,
  });

  return result.matches.map((match) => ({
    id: match.id,
    metadata: match.metadata,
    score: match.score,
  }));
}
