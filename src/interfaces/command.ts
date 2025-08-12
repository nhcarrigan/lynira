/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */
import type { Lynira } from "./lynira.js";
import type { ChatInputCommandInteraction } from "discord.js";

export type Command = (
  lynira: Lynira,
  interaction: ChatInputCommandInteraction
)=> Promise<void>;
