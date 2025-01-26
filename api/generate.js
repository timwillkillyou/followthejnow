import Replicate from "replicate";

export default async function handler(req, res) {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY,
  });

  // Schritt 1: Text generieren
  let sceneText;
  try {
    const textResponse = await replicate.run(
      "meta/llama-3-70b-instruct",
      {
        input: {
          prompt: `GENERATE HORROR SCENE ABOUT SCHIZOPHRENIC PATIENT J IN ASYLUM. OUTPUT FORMAT:
          
          ## SCENE
          [2-3 Sätze Horror-Atmosphäre]
          
          ## CHOICES
          1) [Entscheidung A]
          2) [Entscheidung B]`,
          max_tokens: 500,
        },
      }
    );
    sceneText = textResponse.join("");
  } catch (error) {
    return res.status(500).json({ error: "Text generation failed" });
  }

  // Schritt 2: Bild generieren
  let imageUrl;
  try {
    const imageResponse = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: `Horror game scene: ${sceneText}`,
          negative_prompt: "cartoon, happy, colorful",
        },
      }
    );
    imageUrl = imageResponse[0];
  } catch (error) {
    imageUrl = "https://via.placeholder.com/600x300.png?text=Image+Failed";
  }

  // Antwort senden
  res.status(200).json({
    text: sceneText,
    image: imageUrl,
    choices: ["Enter the dark room", "Run away"], // Vereinfacht für Test
  });
}
