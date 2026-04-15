import { GoogleGenAI } from './node_modules/@google/genai/dist/node/index.mjs';

const apiKey = "AIzaSyC4Wk5yevUhxCqm3s5coeoPar6ijQ8M66w";
const ai = new GoogleGenAI({ apiKey });

async function testModel(modelName) {
    try {
        console.log(`Testing model: ${modelName}...`);
        const response = await ai.models.generateContent({
            model: modelName,
            contents: "Hello, tell me which model you are.",
        });
        console.log(`✅ Success with ${modelName}:`, response.text || "No text but success");
        return true;
    } catch (error) {
        console.error(`❌ Error with ${modelName}:`, error.message);
        return false;
    }
}

async function runTests() {
    await testModel("gemini-1.5-flash");
    await testModel("gemini-1.5-flash-latest");
    await testModel("gemini-2.0-flash");
    await testModel("gemini-2.5-flash");
    await testModel("gemini-flash-latest");
}

runTests();
