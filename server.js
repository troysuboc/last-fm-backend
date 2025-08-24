import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Replace with your Last.fm API key
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

// Proxy endpoint for Last.fm
app.get("/lastfm", async (req, res) => {
  const { method, user, limit = 5, period } = req.query;

  if (!method || !user) return res.status(400).json({ error: "Missing parameters" });

  const url = new URL("https://ws.audioscrobbler.com/2.0/");
  url.searchParams.set("method", method);
  url.searchParams.set("user", user);
  url.searchParams.set("api_key", LASTFM_API_KEY);
  url.searchParams.set("format", "json");
  if (limit) url.searchParams.set("limit", limit);
  if (period) url.searchParams.set("period", period);

  try {
    const response = await fetch(url.toString());
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Last.fm data" });
  }
});

app.listen(PORT, () => console.log(`Last.fm proxy running on port ${PORT}`));
