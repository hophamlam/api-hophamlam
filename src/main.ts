// main.ts
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { sendDiscordWebhook } from "./sendDiscord";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import "dotenv/config";
import { DISCORD_CHANNELS } from "./discordChannels";
import { extractVCBData } from "./validators";

const SECRET_TOKEN = process.env.WEBHOOK_SECRET_TOKEN;
const app = express();
const port = process.env.PORT;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use("/webhook", limiter);
app.use(bodyParser.json({ limit: "10kb" }));
app.use(helmet());
app.disable("x-powered-by");

app.post("/webhook", (req: Request, res: Response) => {
  const token = req.headers["x-auth-token"];

  if (token !== SECRET_TOKEN) {
    return res.status(403).send("Invalid token");
  }

  const payload = req.body;

  if (payload.type === "com.VCB") {
    const extractedData = extractVCBData(payload.body);
    if (!extractedData) {
      return res.status(400).send("Invalid payload body for com.vcb");
    }

    if (
      extractedData.accountNumber === "1012842851" &&
      extractedData.debitCredit === "+"
    ) {
      const webhookUrl = DISCORD_CHANNELS["com.VCB"] || "";
      sendDiscordWebhook(webhookUrl, payload.body, extractedData); // Passing the extracted data
    } else {
      // For all other cases within the "com.vcb" type
      const webhookUrl = DISCORD_CHANNELS["default"] || "";
      sendDiscordWebhook(webhookUrl, payload.body);
    }
  } else {
    // For all other webhook types
    const webhookUrl = DISCORD_CHANNELS["default"] || "";
    if (!webhookUrl) {
      return res.status(500).send("Default webhook URL not set");
    }
    sendDiscordWebhook(webhookUrl, payload.body);
  }
  res.status(200).send("Webhook processed successfully");
});

app.post("/uptime", (req: Request, res: Response) => {
  const token = req.headers["x-auth-token"];
  if (token !== SECRET_TOKEN) {
    return res.status(403).send("Invalid token");
  }
  res.status(200).send("Server is up and running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

console.log("Hello from main.ts!");
