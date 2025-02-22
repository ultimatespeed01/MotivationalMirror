import { Quote } from "@shared/schema";

interface QuotableResponse {
  _id: string;
  content: string;
  author: string;
}

async function fetchWithRetry(url: string, retries = 3, delay = 1000): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error(`Failed after ${retries} attempts`);
}

export async function fetchRandomQuote(): Promise<Quote> {
  try {
    console.log("Fetching random quote from Quotable API...");
    const response = await fetchWithRetry("https://api.quotable.io/random");

    if (!response.ok) {
      console.error(`Quotable API error: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch quote: ${response.status} ${response.statusText}`);
    }

    const data: QuotableResponse = await response.json();
    console.log("Received quote data:", data);

    // Convert the string _id to a number for our schema
    const id = Array.from(data._id).reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);

    return {
      id: Math.abs(id), // Ensure positive number
      content: data.content,
      author: data.author
    };
  } catch (error) {
    console.error("Error fetching quote:", error);
    throw error;
  }
}