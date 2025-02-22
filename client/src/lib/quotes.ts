import { Quote } from "@shared/schema";

interface QuotableResponse {
  _id: string;
  content: string;
  author: string;
}

export async function fetchRandomQuote(): Promise<Quote> {
  const response = await fetch("https://api.quotable.io/random");
  if (!response.ok) {
    throw new Error("Failed to fetch quote");
  }

  const data: QuotableResponse = await response.json();

  // Convert the string _id to a number for our schema
  // Use a hash of the string to generate a stable number
  const id = Array.from(data._id).reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);

  return {
    id: Math.abs(id), // Ensure positive number
    content: data.content,
    author: data.author
  };
}