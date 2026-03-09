import express from "express";
import { createServer as createViteServer } from "vite";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("digigold.db");
const JWT_SECRET = process.env.JWT_SECRET || "namitha-gold-secret-2026";

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    kyc_status TEXT DEFAULT 'pending',
    gold_balance REAL DEFAULT 0,
    wallet_balance REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type TEXT NOT NULL, -- buy, sell, sip, redeem
    gold_amount REAL,
    price REAL,
    status TEXT DEFAULT 'success',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS sip_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    monthly_amount REAL,
    next_debit_date DATETIME,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

async function startServer() {
  const app = express();
  app.use(express.json());

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // --- API Routes ---

  // Auth
  app.post("/api/auth/register", async (req, res) => {
    const { name, email, phone, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const stmt = db.prepare("INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)");
      const result = stmt.run(name, email, phone, hashedPassword);
      const token = jwt.sign({ id: result.lastInsertRowid, email }, JWT_SECRET);
      res.json({ token, user: { id: result.lastInsertRowid, name, email, phone } });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, gold_balance: user.gold_balance, kyc_status: user.kyc_status } });
  });

  // User Data
  app.get("/api/user/profile", authenticateToken, (req: any, res) => {
    const user = db.prepare("SELECT id, name, email, phone, kyc_status, gold_balance, wallet_balance FROM users WHERE id = ?").get(req.user.id);
    res.json(user);
  });

  // Gold Price (Mocked for demo, but structure is there)
  app.get("/api/gold/price", (req, res) => {
    // In a real app, fetch from goldapi.io
    const basePrice = 6200;
    const fluctuation = (Math.random() - 0.5) * 20;
    res.json({ price: basePrice + fluctuation, unit: "gram", currency: "INR" });
  });

  // Buy Gold
  app.post("/api/gold/buy", authenticateToken, (req: any, res) => {
    const { amount, goldGrams, price } = req.body;
    const userId = req.user.id;

    db.transaction(() => {
      db.prepare("UPDATE users SET gold_balance = gold_balance + ? WHERE id = ?").run(goldGrams, userId);
      db.prepare("INSERT INTO transactions (user_id, type, gold_amount, price) VALUES (?, 'buy', ?, ?)").run(userId, goldGrams, price);
    })();

    res.json({ success: true, message: "Gold purchased successfully" });
  });

  // Sell Gold
  app.post("/api/gold/sell", authenticateToken, (req: any, res) => {
    const { goldGrams, price } = req.body;
    const userId = req.user.id;

    const user: any = db.prepare("SELECT gold_balance FROM users WHERE id = ?").get(userId);
    if (user.gold_balance < goldGrams) {
      return res.status(400).json({ error: "Insufficient gold balance" });
    }

    db.transaction(() => {
      db.prepare("UPDATE users SET gold_balance = gold_balance - ? WHERE id = ?").run(goldGrams, userId);
      db.prepare("INSERT INTO transactions (user_id, type, gold_amount, price) VALUES (?, 'sell', ?, ?)").run(userId, goldGrams, price);
    })();

    res.json({ success: true, message: "Gold sold successfully" });
  });

  // SIP
  app.post("/api/sip/create", authenticateToken, (req: any, res) => {
    const { amount } = req.body;
    const userId = req.user.id;
    const nextDebit = new Date();
    nextDebit.setMonth(nextDebit.getMonth() + 1);

    db.prepare("INSERT INTO sip_plans (user_id, monthly_amount, next_debit_date) VALUES (?, ?, ?)").run(userId, amount, nextDebit.toISOString());
    res.json({ success: true });
  });

  app.get("/api/sip/list", authenticateToken, (req: any, res) => {
    const sips = db.prepare("SELECT * FROM sip_plans WHERE user_id = ?").all(req.user.id);
    res.json(sips);
  });

  // Transactions
  app.get("/api/transactions", authenticateToken, (req: any, res) => {
    const transactions = db.prepare("SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC").all(req.user.id);
    res.json(transactions);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
