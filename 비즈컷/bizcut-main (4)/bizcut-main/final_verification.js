const API_KEY = "AIzaSyC4Wk5yevUhxCqm3s5coeoPar6ijQ8M66w";

async function verifyFinalModel() {
  console.log("Verifying gemini-3.1-flash-image-preview on v1beta for FINAL fix...");
  const base64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${API_KEY}`, {
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
    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
      const parts = data.candidates[0].content.parts;
      const hasImage = parts.some(p => p.inlineData || p.inline_data);
      if (hasImage) {
        console.log("🚀 FINAL VERIFICATION SUCCESS: Model supports Image-to-Image!");
      } else {
        console.log("❌ VERIFICATION FAILED: Success response but no image data found.");
      }
    } else {
      console.log("❌ VERIFICATION FAILED:", JSON.stringify(data, null, 2));
    }
  } catch (e) {
    console.error("❌ Fetch error:", e.message);
  }
}

verifyFinalModel();
