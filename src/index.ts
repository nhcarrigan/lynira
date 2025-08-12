/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import { PrismaClient } from "@prisma/client";
import { Client, Events } from "discord.js";
import { processCommand } from "./modules/processCommand.js";
import { instantiateServer } from "./server/serve.js";
import { logger } from "./utils/logger.js";
import type { Lynira } from "./interfaces/lynira.js";

const lynira: Lynira = {
  db:      new PrismaClient(),
  discord: new Client({ intents: [] }),
};

lynira.discord.once("ready", () => {
  void logger.log("debug", `Logged in as ${lynira.discord.user?.tag ?? "unknown"}`);
});

lynira.discord.on("error", (error) => {
  void logger.error("Discord client error", error);
});

lynira.discord.on(Events.InteractionCreate, (interaction) => {
  if (interaction.isChatInputCommand()) {
    void processCommand(lynira, interaction);
  }
});

await lynira.db.$connect();
await lynira.discord.login(process.env.BOT_TOKEN);

instantiateServer(lynira);
