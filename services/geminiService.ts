
import { GoogleGenAI, Type } from "@google/genai";
import { AdCopy, SegmentationStrategy, AdObjective } from "../types";

export class GeminiService {
  private static getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  static async analyzeUrlAndMarket(url: string, objective: AdObjective): Promise<{
    copy: AdCopy;
    strategy: SegmentationStrategy;
    visualPrompt: string;
    sources: { title: string; uri: string }[];
  }> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Perform a deep marketing analysis of this URL: ${url}. 
      The goal is a Meta Ads campaign for ${objective}. 
      1. Identify the specific stock or services offered (e.g., if it's a car dealer, what types of cars?).
      2. Define the perfect Meta Ads segmentation (Interests, Behaviors, Demographics).
      3. Create ad copies that highlight specific inventory items found.
      4. Suggest a visual prompt for the creative.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            copy: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                primaryText: { type: Type.STRING },
                description: { type: Type.STRING },
                callToAction: { type: Type.STRING }
              },
              required: ["headline", "primaryText", "description", "callToAction"]
            },
            strategy: {
              type: Type.OBJECT,
              properties: {
                audienceName: { type: Type.STRING },
                ageRange: { type: Type.STRING },
                locations: { type: Type.ARRAY, items: { type: Type.STRING } },
                interests: { type: Type.ARRAY, items: { type: Type.STRING } },
                behaviors: { type: Type.ARRAY, items: { type: Type.STRING } },
                detailedTargetingSummary: { type: Type.STRING },
                stockFindings: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["audienceName", "ageRange", "interests"]
            },
            visualPrompt: { type: Type.STRING }
          },
          required: ["copy", "strategy", "visualPrompt"]
        }
      }
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title || 'Source',
        uri: chunk.web?.uri || ''
      })).filter((s: any) => s.uri) || [];

    return {
      ...JSON.parse(response.text || '{}'),
      sources
    };
  }

  static async generateBanner(prompt: string): Promise<string> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `Professional Meta Ad: ${prompt}. Cinematic lighting, commercial quality.` }],
      },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (part?.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    throw new Error("Failed image");
  }

  static async generateVideo(prompt: string): Promise<string> {
    const ai = this.getAI();
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Ad video: ${prompt}. High engagement, 4k.`,
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '9:16' }
    });

    while (!operation.done) {
      await new Promise(r => setTimeout(r, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  }
}
