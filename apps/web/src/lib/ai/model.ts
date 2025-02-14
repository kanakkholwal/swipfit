import { createVertex } from "@ai-sdk/google-vertex/edge";

import { createDeepSeek } from '@ai-sdk/deepseek';

export const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
});


export const vertex = createVertex({
  project: process.env.GOOGLE_VERTEX_PROJECT,
  location: process.env.GOOGLE_VERTEX_LOCATION,
  googleCredentials: {
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_PRIVATE_KEY,
  },
});


export const textEmbeddingModel = vertex.textEmbeddingModel("text-embedding-004")

export const chatModel = vertex("gemini-2.0-flash-001")
// export const chatModel = deepseek('deepseek-chat')
