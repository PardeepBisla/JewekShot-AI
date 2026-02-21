
import { GoogleGenAI } from "@google/genai";

export async function generateJewelryPhoto(
  base64Images: string[],
  placement: string,
  style: string,
  customPrompt: string
): Promise<string[]> {
  // Use a safer way to access API_KEY
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure the project is properly configured.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const imageParts = base64Images.map(img => ({
    inlineData: {
      data: img.split(',')[1],
      mimeType: 'image/png',
    },
  }));

  const systemInstruction = `
    You are an AI product-visualization engine for the jewellery industry.
    Your PRIMARY responsibility is to preserve the exact physical identity of the jewellery provided in the reference image.

    ABSOLUTE RULES:
    1. SINGLE SOURCE OF TRUTH: Reproduced the jewellery EXACTLY as shown in the reference image. Preserve design, proportions, dimensions, stone count, stone placement.
    2. FIDELITY: Preserve metal color, polish, engravings, textures, prongs, and links. Visual accuracy is more important than creativity.
    3. MUST NOT: Do NOT redesign, enhance, beautify, or stylize the jewellery. Do NOT add, remove, merge, or modify stones or metal parts.
    4. BACKGROUND: Default background is pure white (#FFFFFF). No props, stands, mannequins, humans, hands, or skin. No lifestyle elements.
    5. LIGHTING: Neutral studio lighting only. Even illumination. Minimal shadow directly under the product only. No reflections that distort geometry.
    6. GOAL: Create a clean professional jewellery product photo that is e-commerce catalog-ready. Ultra-sharp, photorealistic, and distortion-free.
  `;

  const variants = [
    {
      id: 'catalog-main',
      label: 'Main Catalog Shot',
      prompt: `${systemInstruction} 
      SCENE: A clean, centered product photograph on a pure white background.
      TECHNICAL: Exact 1:1 reproduction of the reference jewelry. Sharp focus, zero distortion.
      ${customPrompt}`
    },
    {
      id: 'catalog-top',
      label: 'Technical Top View',
      prompt: `${systemInstruction} 
      SCENE: A technical top-down view of the jewelry, centered on a pure white background.
      TECHNICAL: Preserving every stone and metal link exactly. High clarity.
      ${customPrompt}`
    },
    {
      id: 'catalog-macro',
      label: 'Macro Detail View',
      prompt: `${systemInstruction} 
      SCENE: A focused macro-detail shot of the most complex part of the jewelry design.
      TECHNICAL: Pure white background, emphasizing the exact material texture and stone facets as seen in reference.
      ${customPrompt}`
    }
  ];

  try {
    const promises = variants.map(async (variant) => {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            ...imageParts,
            { text: variant.prompt }
          ],
        },
      });

      let imageUrl: string | null = null;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      }
      return imageUrl;
    });

    const results = await Promise.all(promises);
    const finalImages = results.filter((img): img is string => img !== null);

    if (finalImages.length === 0) {
      throw new Error("No imagery candidates were returned. Please try with clearer source photos.");
    }

    return finalImages;
  } catch (error: any) {
    if (error.message?.includes('fetch')) {
      throw new Error("Network Error: Could not reach the AI synthesis server. Please check your internet connection.");
    }
    throw error;
  }
}
