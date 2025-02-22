import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { fetchRandomQuote } from "../client/src/lib/quotes";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/quotes/random", async (_req, res) => {
    try {
      const quote = await fetchRandomQuote();
      res.json(quote);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quote" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
