// src/app.ts
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { sendDiscordWebhook } from "./sendDiscord";
// import { getTodayLunar } from "./yourLunarModule"; // Import the function to get lunar data
import "dotenv/config";

const app = express();
const port = process.env.PORT;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Define a POST route to handle the webhook
app.post("/webhook", (req: Request, res: Response) => {
  const payload = req.body; // Webhook payload
  console.log("Received webhook:", payload);
  res.status(200).send("Webhook received successfully");
  sendDiscordWebhook();
});

// Define a GET route to get today's lunar data
app.get("/lunar", (req: Request, res: Response) => {
  // const lunarData = getTodayLunar(); // Call the function to get lunar data
  res.json({ lunarData: "test-lunarData" });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
