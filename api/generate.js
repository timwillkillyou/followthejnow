import Replicate from "replicate";  

export default async function handler(req, res) {  
  const replicate = new Replicate({  
    auth: process.env.REPLICATE_API_KEY  
  });  

  try {  
    // Text generieren  
    const textResponse = await replicate.run(  
      "meta/llama-3-70b-instruct",  
      {  
        input: {  
          prompt: `  
          DU BIST HORROR-AUTOR.  
          AKTUELLE ANWEISUNG: ${req.body.prompt}  
          FORMATIERE SO:  
          ## SCENE  
          [Max. 3 Sätze]  
          ## CHOICES  
          1) [Entscheidung A]  
          2) [Entscheidung B]  
          `,  
          max_tokens: 500  
        }  
      }  
    );  

    const sceneText = textResponse.join("");  
    const choices = sceneText  
      .split("## CHOICES")[1]  
      .split("\n")  
      .filter(line => line.trim().startsWith("1)") || line.trim().startsWith("2)"))  
      .map(line => line.replace(/^\d+\)\s*/, ""));  

    // Bild generieren  
    const imageResponse = await replicate.run(  
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",  
      {  
        input: {  
          prompt: `Horror-Spiel Szene: ${sceneText}`,  
          negative_prompt: "cartoon, cute, happy",  
          width: 1024,  
          height: 512  
        }  
      }  
    );  

    res.status(200).json({  
      text: sceneText,  
      image: imageResponse[0],  
      choices: choices  
    });  

  } catch (error) {  
    console.error("Fehler:", error);  
    res.status(500).json({ error: "API-Aufruf fehlgeschlagen" });  
  }  
}  
