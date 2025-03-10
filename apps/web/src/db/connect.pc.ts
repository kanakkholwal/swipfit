import { Pinecone } from '@pinecone-database/pinecone';


export const pineconeIndex = 'products-index';

export const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});


// await pinecone.createIndexForModel({
//     name: pineconeIndex,
//     cloud: 'aws',
//     region: 'us-east-1',
//     embed: {
//         model: 'llama-text-embed-v2',
//         fieldMap: { text: 'chunk_text' },
//     },
//     waitUntilReady: true,
// });