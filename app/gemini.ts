import {
  GoogleGenerativeAI,
  GenerationConfig,
  SafetySetting,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

/**
 * @description Defines the structure for a single dish suggestion.
 */
export interface DishSuggestion {
  dishName: string;
  preparationTime: string;
  keyIngredients: string[];
  youtubeSearchQuery: string;
}

/**
 * @description Defines the structure of the JSON response we expect from Gemini.
 */
export interface GeminiFoodResponse {
  suggestions: DishSuggestion[];
}

// In-memory cache to store results. For production, a more persistent
// cache like Redis or Vercel's Data Cache would be more suitable.
const cache = new Map<string, GeminiFoodResponse>();

/**
 * Generates food suggestions for a given country and meal type using Google's Gemini AI.
 * It includes caching to reduce redundant API calls.
 *
 * @param country The country to get traditional dishes from.
 * @param mealType The type of meal (e.g., "breakfast", "lunch", "dinner").
 * @returns A promise that resolves to an object containing dish suggestions.
 */
export async function getFoodSuggestions(
  country: string,
  mealType: string
): Promise<GeminiFoodResponse | null> {
  const cacheKey = `${country.toLowerCase()}-${mealType.toLowerCase()}`;
  if (cache.has(cacheKey)) {
    console.log(`[Cache] HIT for ${cacheKey}`);
    return cache.get(cacheKey)!;
  }
  console.log(`[Cache] MISS for ${cacheKey}`);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const generationConfig: GenerationConfig = {
    responseMimeType: "application/json",
    temperature: 0.7,
  };

  // Safety settings to ensure the model provides appropriate content.
  const safetySettings: SafetySetting[] = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const prompt = `
    You are an expert culinary guide. Your task is to provide exactly 3 traditional dish suggestions for a specific country and meal type.

    Rules:
    - The output must be a valid JSON object.
    - The root object must have a single key: "suggestions".
    - The "suggestions" key must be an array of 3 dish objects.
    - Each dish object must have the following keys: "dishName" (string), "preparationTime" (string, e.g., "Approx. 45 minutes"), "keyIngredients" (array of strings), and "youtubeSearchQuery" (string, a concise and effective search query for finding a recipe video on YouTube).

    Country: ${country}
    Meal Type: ${mealType}
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
      safetySettings,
    });

    const responseText = result.response.text();
    const parsedResponse: GeminiFoodResponse = JSON.parse(responseText);

    // Validate the structure before caching
    if (
      !parsedResponse.suggestions ||
      parsedResponse.suggestions.length !== 3
    ) {
      throw new Error("Invalid response structure from Gemini API.");
    }

    // Store the valid response in the cache
    cache.set(cacheKey, parsedResponse);

    return parsedResponse;
  } catch (error) {
    console.error("Error fetching suggestions from Gemini:", error);
    return null;
  }
}