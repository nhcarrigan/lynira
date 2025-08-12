/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */
import { getEntitlement } from "../modules/getEntitlement.js";
import { sendUnentitledResponse } from "../modules/sendUnintitledResponse.js";
import { errorHandler } from "../utils/errorHandler.js";
import { logger } from "../utils/logger.js";
import type { Command } from "../interfaces/command.js";

/**
 * Handles the `/remove` command interaction.
 * @param lynira - Lynira's Discord instance.
 * @param interaction - The command interaction payload from Discord.
 */
export const remove: Command = async(lynira, interaction) => {
  try {
    const subscription = await getEntitlement(lynira, interaction.user.id);
    if (!subscription) {
      await sendUnentitledResponse(interaction);
      return;
    }
    const slug = interaction.options.getString("slug", true);
    const slugExists = await lynira.db.links.findFirst({ where: {
      deleted: false,
      slug:    slug,
      userId:  interaction.user.id,
    } });
    if (!slugExists) {
      await interaction.editReply({
        content: "This slug does not exist, or does not belong to you.",
      });
      return;
    }
    await lynira.db.links.delete({
      where: {
        id: slugExists.id,
      },
    });
    await interaction.editReply({
      content: `Short URL <https://lynira.link/${slug}> has been removed. Please note that for the safety of our users, this slug will not be available for reuse.`,
    });
    await logger.log("info", `User ${interaction.user.id} removed a short URL with slug "${slug}".`);
  } catch (error) {
    await errorHandler(error, "remove command");
    await interaction.editReply({
      content:
        // eslint-disable-next-line stylistic/max-len -- Big boi string.
        "An error occurred while processing your request. Please try again later.",
    });
  }
};
