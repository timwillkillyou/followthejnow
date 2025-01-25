import Replicate from "replicate";  

export default async function handler(req, res) {  
  const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY });  

  // Text generieren  
  const textOutput = await replicate.run(  
    "meta/llama-3-70b-instruct",  
    {  
      input: {  
        prompt: req.body.prompt + "\nAntworte in Markdown mit: ## Szene\n...\n## Entscheidungen\n1) ...\n2) ...",  
        max_tokens: 1000  
      }  
    }  
  );  

  // Bild generieren  
  const imageOutput = await replicate.run(  
    "stability-ai/sdxl",  
    {  
      input: {  
        prompt: req.body.prompt + "Horror-Stil, düster, 8k, Blut, surreal",  
        negative_prompt: "cartoon, bunt, niedlich"  
      }  
    }  
  );  

  res.status(200).json({  
    text: textOutput.join(""),  
    image: imageOutput[0],  
    choices: ["Entscheidung A", "Entscheidung B"] // Parsen aus Text  
  });  
}  
