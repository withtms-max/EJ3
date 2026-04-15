import { GoogleGenAI } from './node_modules/@google/genai/dist/node/index.mjs';

const apiKey = "AIzaSyC4Wk5yevUhxCqm3s5coeoPar6ijQ8M66w";
// Let's try v1 instead of the default v1beta
const ai = new GoogleGenAI({ apiKey, apiVersion: 'v1' });

async function listModels() {
    try {
        console.log("Listing models with v1...");
        const models = await ai.models.list();
        for await (const model of models) {
            console.log(model.name);
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
