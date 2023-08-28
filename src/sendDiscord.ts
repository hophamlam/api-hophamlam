import axios from "axios";
import "dotenv/config";

export function sendDiscordWebhook() {
  const data = JSON.stringify({
    username: "Nhận chuyển khoản VCB 1012.842.851",
    content: "Nhận VNĐ",
    embeds: [
      {
        author: {
          name: "Hồ Phạm Lâm - VCB - 1012.842.851",
        },
        title: "💵 VNĐ",
        color: "5613637",
        fields: [
          {
            name: "⏲️",
            value: "🗎",
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
