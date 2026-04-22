const API_KEY = "AIzaSyC4Wk5yevUhxCqm3s5coeoPar6ijQ8M66w";

async function testImageToImage() {
  console.log("Testing Image-to-Image generation with gemini-2.5-flash...");
  
  // Dummy 1x1 transparent PNG in base64
  const base64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: "image/png", data: base64Image } },
            { text: "Enhance this image to look like a professional studio portrait. Output the result as an image." }
          ]
        }],
        generationConfig: {
          responseModalities: ["IMAGE", "TEXT"]
        }
      })
    });

    const data = await response.json();
    console.log("Response status:", response.status);
    
    if (data.error) {
      console.error("❌ API Error:", JSON.stringify(data.error, null, 2));
    } else if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
      const parts = data.candidates[0].content.parts;
      console.log("✅ Success! Response parts:", parts.map(p => Object.keys(p)));
      const hasImage = parts.some(p => p.inlineData || p.inline_data);
      console.log("Has image response:", hasImage);
    } else {
      console.log("⚠️ Unexpected response format:", JSON.stringify(data, null, 2));
    }
  } catch (e) {
    console.error("❌ Fetch error:", e.message);
  }
}

testImageToImage();
