const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_SERVICE_URL =
  process.env.DATA_SERVICE_URL || "http://data-service:3002";

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

// Readiness check
app.get("/ready", (req, res) => {
  res.json({ status: "ready" });
});

// Read item by ID
app.get("/api/items/:id", async (req, res) => {
  try {
    const start = Date.now();
    const response = await axios.get(
      `${DATA_SERVICE_URL}/items/${req.params.id}`
    );
    const duration = Date.now() - start;
    console.log(`[data-service] GET /items/${req.params.id} - ${duration}ms`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// List all items
app.get("/api/items", async (req, res) => {
  try {
    const response = await axios.get(`${DATA_SERVICE_URL}/items`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API Gateway running on port ${PORT}`);
});
