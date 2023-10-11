// discordChannels.ts
type DiscordChannelsType = {
  [key: string]: string | undefined;
};

export const DISCORD_CHANNELS: DiscordChannelsType = {
  "default": process.env.GAOLAMTHUY_TEST_DISCORD_WEBHOOK_URL,
  "com.VCB": process.env.GAOLAMTHUY_BANKTRANS_DISCORD_WEBHOOK_URL,
  // ... other channels if needed in the future
};
