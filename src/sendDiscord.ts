import axios from "axios";
import "dotenv/config";

export function sendDiscordWebhook() {
  const data = JSON.stringify({
    username: "Test webhook",
    content: "Nhận VNĐ",
    embeds: [
      {
        author: {
          name: "test-name-embed",
        },
        title: "test-title-embed",
        color: "5613637",
        fields: [
          {
            name: "⏲️test-field-name",
            value: "🗎 test-value",
          },
        ],
      },
    ],
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: process.env.TEST_DISCORD_WEBHOOK_URL,
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
      console.log(error);
    });
}
