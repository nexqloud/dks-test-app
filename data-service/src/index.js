const express = require("express");

const app = express();
const PORT = process.env.PORT || 3002;

// Preloaded items (10 items)
const items = [
  { id: 1, name: "Item 1", category: "electronics", price: 99.99 },
  { id: 2, name: "Item 2", category: "clothing", price: 49.99 },
  { id: 3, name: "Item 3", category: "books", price: 19.99 },
  { id: 4, name: "Item 4", category: "food", price: 9.99 },
  { id: 5, name: "Item 5", category: "toys", price: 29.99 },
  { id: 6, name: "Item 6", category: "electronics", price: 199.99 },
  { id: 7, name: "Item 7", category: "clothing", price: 79.99 },
  { id: 8, name: "Item 8", category: "books", price: 14.99 },
  { id: 9, name: "Item 9", category: "food", price: 24.99 },
  { id: 10, name: "Item 10", category: "toys", price: 59.99 },
];

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

// Readiness check
app.get("/ready", (req, res) => {
  res.json({ status: "ready" });
});

// Read item by ID (1-10)
app.get("/items/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = items.find((i) => i.id === id);

  if (!item) {
    return res.status(404).json({ error: "Item not found" });
  }

  res.json({ item });
});

// List all items
app.get("/items", (req, res) => {
  res.json({ items });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Data service running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});
