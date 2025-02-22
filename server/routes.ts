import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { fetchRandomQuote } from "./lib/quotes";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/quotes/random", async (_req, res) => {
    try {
      console.log("Handling /api/quotes/random request");
      const quote = await fetchRandomQuote();
      console.log("Successfully fetched quote:", quote);
      res.json(quote);
    } catch (error) {
      console.error("Failed to fetch quote:", error);
      res.status(500).json({ 
        message: "Failed to fetch quote",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}