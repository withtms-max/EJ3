import { GoogleGenAI } from './node_modules/@google/genai/dist/node/index.mjs';

const apiKey = "AIzaSyC4Wk5yevUhxCqm3s5coeoPar6ijQ8M66w";
const ai = new GoogleGenAI({ apiKey });

async function listModels() {
    try {
        console.log("Listing models...");
        // This SDK might have a different way to list models.
        // Let's check the d.ts again or try common patterns.
        const models = await ai.models.list();
        for await (const model of models) {
            console.log(model.name);
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
