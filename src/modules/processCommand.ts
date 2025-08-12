/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import { MessageFlags } from "discord.js";
import { handlers } from "../config/handlers.js";
import type { Command } from "../interfaces/command.js";

/**
 * Process a command interaction.
 * @param lynira - The Lynira instance.
 * @param interaction - The interaction to process.
 */
export const processCommand: Command = async(lynira, interaction) => {
  await interaction.deferReply({
    flags: [ MessageFlags.Ephemeral ],
  });
  const { commandName } = interaction;
  // eslint-disable-next-line no-underscore-dangle -- Accessing private property for command handler.
  await (handlers[commandName] ?? handlers._default)(lynira, interaction);
};
