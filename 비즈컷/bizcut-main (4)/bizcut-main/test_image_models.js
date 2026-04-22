const API_KEY = "AIzaSyC4Wk5yevUhxCqm3s5coeoPar6ijQ8M66w";

async function testModel(modelName) {
  console.log(`Testing Image-to-Image with ${modelName}...`);
  const base64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: "image/png", data: base64Image } },
            { text: "Enhance this image. Output only the modified image." }
          ]
        }],
        generationConfig: {
          responseModalities: ["IMAGE"]
        }
      })
    });

    const data = await response.json();
    if (data.error) {
      console.log(`❌ ${modelName} Error:`, data.error.message);
    } else if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
      const parts = data.candidates[0].content.parts;
      const hasImage = parts.some(p => p.inlineData || p.inline_data);
      console.log(`✅ ${modelName} Success! Has image:`, hasImage);
    } else {
      console.log(`⚠️ ${modelName} Unexpected response.`);
    }
  } catch (e) {
    console.log(`❌ ${modelName} Fetch error:`, e.message);
  }
}

async function run() {
  await testModel("gemini-2.0-flash");
  await testModel("gemini-2.0-flash-exp");
  await testModel("gemini-2.0-pro-exp-02-05");
}

run();
