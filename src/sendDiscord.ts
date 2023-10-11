// sendDiscord.ts
import axios from "axios";
import "dotenv/config";
import dayjs from "dayjs";
import "dayjs/locale/vi"; // Import Vietnamese locale
import localizedFormat from "dayjs/plugin/localizedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";

// Use plugins
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);

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
        title: `💵 ${data.amount} VND`,
        color: 5613637,
        fields: [
          {
            name: `⏲️ ${formatDatetimeForVN(data.datetime)}`,
            value: `🗎 ${data.description}`,
          },
        ],
      },
    ],
  };
}

function formatDatetimeForVN(datetime: string): string {
  dayjs.locale("vi"); // Set locale to Vietnamese
  const date = dayjs(datetime, "DD-MM-YYYY HH:mm:ss"); // Parsing the datetime
  const formattedDate = date.format("dddd, DD-MM-YYYY HH:mm:ss"); // Convert it to desired format
  return capitalizeFirstLetterEachWord(formattedDate); // Capitalize the first letter of each word
}

function capitalizeFirstLetterEachWord(phrase: string): string {
  return phrase
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
