import { Pinecone } from '@pinecone-database/pinecone';


export const pineconeIndexName = 'products-index';

export const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});


export const model = 'llama-text-embed-v2';
export const pineconeIndex = pinecone.Index(pineconeIndexName);
