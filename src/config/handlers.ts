/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import { about } from "../commands/about.js";
import { add } from "../commands/add.js";
import { list } from "../commands/list.js";
import type { Command } from "../interfaces/command.js";

const defaultHandler: Command = async(_lynira, interaction) => {
  await interaction.editReply({
    content: "This command is not implemented yet.",
  });
};

export const handlers: { _default: Command } & Record<string, Command> = {
  _default: defaultHandler,
  about:    about,
  add:      add,
  list:     list,
};
