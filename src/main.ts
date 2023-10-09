import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { sendDiscordWebhook } from "./sendDiscord";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import "dotenv/config";
import { DISCORD_CHANNELS } from "./discordChannels";

const SECRET_TOKEN = process.env.WEBHOOK_SECRET_TOKEN;

const app = express();
const port = process.env.PORT;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
// Apply the rate limiter to the webhook route
app.use("/webhook", limiter);
app.use(bodyParser.json({ limit: "10kb" })); // Adjust as needed
// Middleware to parse JSON in request body
app.use(helmet());
app.disable("x-powered-by");

// Define a POST route to handle the webhook
app.post("/webhook", (req: Request, res: Response) => {
  const token = req.headers["x-auth-token"];

  if (token !== SECRET_TOKEN) {
    return res.status(403).send("Invalid token");
  }

  const payload = req.body;

  // Validation of type
  if (!DISCORD_CHANNELS[payload.type]) {
    return res.status(400).send("Invalid payload type");
  }
  const webhookUrl = DISCORD_CHANNELS[payload.type];
  if (!webhookUrl) {
    return res.status(400).send("Webhook URL not found for the given type");
  }
  console.log("Received webhook from ", req.ip);
  res.status(200).send("Webhook received successfully");
  // Based on the type, send to the correct Discord channel
  sendDiscordWebhook(webhookUrl, payload.body);
  console.log("Received token:", token);
  console.log("Expected token:", SECRET_TOKEN);
});

// for uptime-kuma check if server is up
app.post("/uptime", (req: Request, res: Response) => {
  const token = req.headers["x-auth-token"];

  if (token !== SECRET_TOKEN) {
    return res.status(403).send("Invalid token");
  }

  res.status(200).send("Server is up and running!");
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
