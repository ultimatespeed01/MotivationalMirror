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
  return {
    id: parseInt(data._id, 10),
    content: data.content,
    author: data.author
  };
}
