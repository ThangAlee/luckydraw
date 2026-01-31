
import { GoogleGenAI } from "@google/genai";

export const generateFestiveMessage = async (winnerName: string, prizeName: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Bạn là host của tiệc Tết. Hãy viết 1 câu chúc Tết CỰC KỲ NGẮN GỌN (tối đa 6 từ) cho ${winnerName} khi trúng ${prizeName}. Ví dụ: "Lộc xuân tràn trề!", "Tết này ấm no rồi!".`,
    });
    return response.text?.trim() || `Chúc mừng ${winnerName}!`;
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Chúc mừng ${winnerName}!`;
  }
};
