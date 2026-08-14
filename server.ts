import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { INITIAL_QUOTES, Quote } from "./src/data/quotesData.js";

// In-memory backend quote store
let quotesStore: Quote[] = [...INITIAL_QUOTES];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Endpoints
  // 1. Get all quotes
  app.get("/api/quotes", (req, res) => {
    res.json({
      success: true,
      count: quotesStore.length,
      data: quotesStore,
    });
  });

  // 2. Get Daily Changing Quote based on Date
  app.get("/api/quotes/daily", (req, res) => {
    const today = new Date();
    // Calculate days since epoch to ensure daily deterministic change
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    // Day-based index hash
    const dailyIndex = (today.getFullYear() * 365 + dayOfYear) % quotesStore.length;
    const dailyQuote = quotesStore[dailyIndex] || quotesStore[0];

    res.json({
      success: true,
      date: today.toISOString().split("T")[0],
      dayOfYear,
      dailyQuote,
    });
  });

  // 3. Add new custom quote to backend database
  app.post("/api/quotes", (req, res) => {
    const { quote, author, category, bgPreset } = req.body;
    if (!quote) {
      return res.status(400).json({ success: false, error: "Quote text is required" });
    }

    const newQuoteObj: Quote = {
      id: Date.now(),
      quote,
      author: author || "FocusOS",
      category: category || "Discipline",
      bgPreset: bgPreset || "mountain",
      isFavorite: false,
    };

    quotesStore.unshift(newQuoteObj);

    res.status(201).json({
      success: true,
      data: newQuoteObj,
    });
  });

  // 4. Toggle Favorite on quote
  app.post("/api/quotes/:id/favorite", (req, res) => {
    const quoteId = Number(req.params.id);
    const item = quotesStore.find((q) => q.id === quoteId);
    if (!item) {
      return res.status(404).json({ success: false, error: "Quote not found" });
    }

    item.isFavorite = !item.isFavorite;
    res.json({
      success: true,
      data: item,
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
