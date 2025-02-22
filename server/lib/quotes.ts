import { Quote } from "@shared/schema";

// Fallback quotes in case the API is unreachable
const fallbackQuotes: Omit<Quote, "id">[] = [
  {
    content: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    content: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    content: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    content: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    content: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt"
  }
];

interface QuotableResponse {
  _id: string;
  content: string;
  author: string;
}

async function getRandomFallbackQuote(): Promise<Quote> {
  const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
  const quote = fallbackQuotes[randomIndex];
  // Generate a random ID for the quote
  return {
    ...quote,
    id: Math.floor(Math.random() * 1000000) + 1
  };
}

async function fetchWithRetry(url: string, retries = 3, delay = 2000): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempt ${i + 1} to fetch quote from API...`);
      const response = await fetch(url);
      if (response.ok) return response;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      console.log(`Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error(`Failed after ${retries} attempts`);
}

export async function fetchRandomQuote(): Promise<Quote> {
  try {
    console.log("Attempting to fetch quote from Quotable API...");
    const response = await fetchWithRetry("https://api.quotable.io/random");
    const data: QuotableResponse = await response.json();
    console.log("Successfully received quote from API:", data);

    const id = Array.from(data._id).reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);

    return {
      id: Math.abs(id),
      content: data.content,
      author: data.author
    };
  } catch (error) {
    console.log("API fetch failed, using fallback quote system");
    return getRandomFallbackQuote();
  }
}