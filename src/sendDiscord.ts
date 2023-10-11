// sendDiscord.ts
import axios from "axios";
import "dotenv/config";

export function sendDiscordWebhook(
  webhookUrl: string,
  message: string,
  data?: {
    accountNumber: string;
    amount: string;
    description: string;
    datetime: string;
  }
) {
  let payload = {};

  if (data) {
    payload = createVCBEmbed(message, data);
  } else {
    payload = {
      username: "Webhook Bot",
      content: message,
    };
  }

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: webhookUrl,
    headers: {
      "Content-Type": "application/json",
    },
    data: payload,
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

function createVCBEmbed(
  originalMessage: string,
  data: {
    accountNumber: string;
    amount: string;
    description: string;
    datetime: string;
  }
) {
  return {
    content: originalMessage,
    embeds: [
      {
        author: {
          name: `${data.accountNumber} - Hồ Phạm Lâm - VCB`,
          icon_url:
            "https://raw.githubusercontent.com/gaolamthuy/gaolamthuy-api/main/static/vcb.png",
        },
        title: `💵 ${data.amount}`,
        color: 5613637,
        fields: [
          {
            name: `⏲️ ${data.datetime}`,
            value: `🗎 ${data.description}`,
          },
        ],
      },
    ],
  };
}
