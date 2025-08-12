/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
  TextDisplayBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";
import { SKU } from "../interfaces/skus.js";

/**
 * Responds with a default image and a button to subscribe.
 * @param interaction - The interaction object from Discord.
 */
export const sendUnentitledResponse = async(
  interaction: ChatInputCommandInteraction,
): Promise<void> => {
  const components = [
    new TextDisplayBuilder().setContent(
      // eslint-disable-next-line stylistic/max-len -- Big boi string.
      "Hmm, you do not seem to have an active subscription. If you wish to continue using my services, you will need to rectify that.",
    ),
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().
        setStyle(ButtonStyle.Premium).
        setSKUId(SKU.PERSONAL),
      new ButtonBuilder().
        setStyle(ButtonStyle.Premium).
        setSKUId(SKU.PROFESSIONAL),
      new ButtonBuilder().
        setStyle(ButtonStyle.Premium).
        setSKUId(SKU.BUSINESS),
      new ButtonBuilder().
        setStyle(ButtonStyle.Premium).
        setSKUId(SKU.ENTERPRISE),
    ),
  ];
  await interaction.editReply({
    components: components,
    flags:      [ MessageFlags.IsComponentsV2 ],
  });
};
