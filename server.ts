import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

// Mock Data
let vegetables = [
  { id: 1, name: "Wortel Segar", price: 5000, stock: 20, category: "Akar", image_url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=400" },
  { id: 2, name: "Bayam Hijau", price: 3000, stock: 15, category: "Daun", image_url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400" },
  { id: 3, name: "Tomat Merah", price: 8000, stock: 10, category: "Buah", image_url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400" },
  { id: 4, name: "Brokoli", price: 12000, stock: 5, category: "Bunga", image_url: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&q=80&w=400" },
  { id: 5, name: "Kentang Dieng", price: 15000, stock: 0, category: "Akar", image_url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=400" },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Auth
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (email === "admin@sayurmart.com" && password === "admin123") {
      res.json({ token: "fake-jwt-token-sayurmart", user: { email, id: 1 } });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });

  // Vegetables CRUD
  app.get("/api/vegetables", (req, res) => {
    res.json(vegetables);
  });

  app.post("/api/vegetables", (req, res) => {
    const newVeg = { ...req.body, id: Date.now() };
    vegetables.push(newVeg);
    res.status(201).json(newVeg);
  });

  app.put("/api/vegetables/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = vegetables.findIndex(v => v.id === id);
    if (index !== -1) {
      vegetables[index] = { ...vegetables[index], ...req.body, id };
      res.json(vegetables[index]);
    } else {
      res.status(404).json({ message: "Vegetable not found" });
    }
  });

  app.delete("/api/vegetables/:id", (req, res) => {
    const id = parseInt(req.params.id);
    vegetables = vegetables.filter(v => v.id !== id);
    res.status(204).end();
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.resolve(distPath, "index.html"));
      });
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
