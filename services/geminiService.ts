
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available from environment variables
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Gets a chat response from Gemini Flash for the chatbot.
 */
export const getChatResponse = async (history: { role: string, parts: { text: string }[] }[], newMessage: string): Promise<string> => {
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: history,
        });
        const response = await chat.sendMessage({ message: newMessage });
        return response.text;
    } catch (error) {
        console.error("Error getting chat response:", error);
        return "Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.";
    }
};

/**
 * Analyzes content using Gemini Pro with Thinking Mode for complex queries.
 */
export const analyzeContentWithThinking = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 32768 }
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing content with thinking mode:", error);
        return "No se pudo analizar el contenido. Inténtalo de nuevo.";
    }
};

/**
 * Performs a search with Google Search grounding for up-to-date information.
 */
export const searchWithGrounding = async (query: string): Promise<{ text: string, sources: any[] }> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Eres un asistente del portal de un municipio. Responde la siguiente pregunta de un ciudadano de forma clara y concisa, basándote en la información más actualizada. La pregunta es: "${query}"`,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        return { text: response.text, sources };
    } catch (error) {
        console.error("Error with search grounding:", error);
        return { text: "No se pudo realizar la búsqueda. Por favor, intenta de nuevo.", sources: [] };
    }
};
