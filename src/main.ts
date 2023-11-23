// main.ts
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { Pool } from "pg"; // Importing pg Pool
import "dotenv/config";
import { sendDiscordWebhook } from "./sendDiscord";
import { DISCORD_CHANNELS } from "./discordChannels";
import { extractVCBData } from "./validators";

const SECRET_TOKEN = process.env.WEBHOOK_SECRET_TOKEN;
const app = express();
const port = process.env.PORT;

// PostgreSQL Client Setup
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT || "5432"),
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

app.use(helmet());
app.disable("x-powered-by");
app.use(limiter);
app.use(express.json({ limit: "10kb" }));

// Webhook Endpoint
app.post("/webhook", (req: Request, res: Response) => {
  const token = req.headers["x-auth-token"];

  if (token !== SECRET_TOKEN) {
    return res.status(403).send("Invalid token");
  }

  const payload = req.body;

  if (payload.type === "com.VCB") {
    const extractedData = extractVCBData(payload.body);
    if (!extractedData) {
      return res.status(400).send("Invalid payload body for com.VCB");
    }

    // Determine the appropriate channel based on conditions
    const channelKey =
      extractedData.accountNumber === "1012842851" &&
      extractedData.debitCredit === "+"
        ? "com.VCB"
        : "default";

    const webhookUrl = DISCORD_CHANNELS[channelKey] || "";
    if (!webhookUrl) {
      return res.status(500).send("Webhook URL not set");
    }

    sendDiscordWebhook(webhookUrl, payload.body, extractedData);
  } else {
    // Default case for other types
    const webhookUrl = DISCORD_CHANNELS["default"] || "";
    if (!webhookUrl) {
      return res.status(500).send("Default webhook URL not set");
    }
    sendDiscordWebhook(webhookUrl, payload.body);
  }

  res.status(200).send("Webhook processed successfully");
});

// Uptime Check Endpoint
app.post("/uptime", (req: Request, res: Response) => {
  const token = req.headers["x-auth-token"];
  if (token !== SECRET_TOKEN) {
    return res.status(403).send("Invalid token");
  }
  res.status(200).send("Server is up and running!");
});

// Test DB Connection Endpoint
app.get("/test-db", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ currentTime: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error connecting to the database");
  }
});

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

console.log("Hello from main.ts v1!");
