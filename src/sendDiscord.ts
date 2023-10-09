import axios from "axios";
import "dotenv/config";

export function sendDiscordWebhook(webhookUrl: string, message: string) {
  const data = JSON.stringify({
    username: "Webhook Bot",
    content: message,
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: webhookUrl,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.error("Error sending to Discord:", error.message);
      // Handle the error more gracefully here, e.g., retry, alert admin, etc.
    });
}
