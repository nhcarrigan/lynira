/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */
import {
  ContainerBuilder,
  TextDisplayBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  MessageFlags,
} from "discord.js";
import { getEntitlement } from "../modules/getEntitlement.js";
import { getLinkComponents } from "../modules/getLinkComponents.js";
import { getSkuLimit } from "../modules/getSkuLimit.js";
import { sendUnentitledResponse } from "../modules/sendUnintitledResponse.js";
import { errorHandler } from "../utils/errorHandler.js";
import type { Command } from "../interfaces/command.js";

/**
 * Handles the `/list` command interaction.
 * @param lynira - Lynira's Discord instance.
 * @param interaction - The command interaction payload from Discord.
 */
export const list: Command = async(lynira, interaction) => {
  try {
    const subscription = await getEntitlement(lynira, interaction.user.id);
    if (!subscription) {
      await sendUnentitledResponse(interaction);
      return;
    }
    const urls = await lynira.db.links.findMany({
      where: {
        deleted: false,
        userId:  interaction.user.id,
      },
    });
    const components: Array<ContainerBuilder | ActionRowBuilder<ButtonBuilder>>
      = getLinkComponents(urls);
    components.push(
      new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `You are currently using ${urls.length.toString()} short URL${
            urls.length === 1
              ? ""
              : "s"
          } out of ${getSkuLimit(subscription.skuId).toString()}.`,
        ),
      ),
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().
          setStyle(ButtonStyle.Link).
          setLabel("Discord Server").
          setURL("https://chat.nhcarrigan.com"),
        new ButtonBuilder().
          setStyle(ButtonStyle.Link).
          setLabel("Forum").
          setURL("https://forum.nhcarrigan.com"),
      ),
    );
    await interaction.editReply({
      components: components,
      flags:      MessageFlags.IsComponentsV2,
    });
  } catch (error) {
    await errorHandler(error, "list command");
    await interaction.editReply({
      content:
        // eslint-disable-next-line stylistic/max-len -- Big boi string.
        "An error occurred while processing your request. Please try again later.",
    });
  }
};
