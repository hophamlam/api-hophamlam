// discordChannels.ts
type DiscordChannelsType = {
  [key: string]: string | undefined;
};

export const DISCORD_CHANNELS: DiscordChannelsType = {
  "vcb-1012842851-trans": process.env.GAOLAMTHUY_BANKTRANS_DISCORD_WEBHOOK_URL,
  "momo-0938568040-trans": process.env.GAOLAMTHUY_BANKTRANS_DISCORD_WEBHOOK_URL,
  "wp-order": process.env.GAOLAMTHUY_WEBORDER_DISCORD_WEBHOOK_URL,
  "test-webhook": process.env.GAOLAMTHUY_TEST_DISCORD_WEBHOOK_URL,
  // ... add more as you get new channels
};
