const API_KEY = "AIzaSyC4Wk5yevUhxCqm3s5coeoPar6ijQ8M66w";

async function checkV1() {
  const models = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"];
  for (const model of models) {
    console.log(`Checking ${model} on v1...`);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "hi" }] }]
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log(`✅ ${model} works on v1!`);
      } else {
        console.log(`❌ ${model} fails on v1: ${JSON.stringify(data.error)}`);
      }
    } catch (e) {
      console.log(`❌ ${model} error: ${e.message}`);
    }
  }
}

checkV1();
