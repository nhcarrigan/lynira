/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */
import { reservedSlugs } from "../config/reservedSlugs.js";
import { getEntitlement } from "../modules/getEntitlement.js";
import { getSkuLimit } from "../modules/getSkuLimit.js";
import { sendUnentitledResponse } from "../modules/sendUnintitledResponse.js";
import { errorHandler } from "../utils/errorHandler.js";
import { logger } from "../utils/logger.js";
import type { Command } from "../interfaces/command.js";

/**
 * Handles the `/add` command interaction.
 * @param lynira - Lynira's Discord instance.
 * @param interaction - The command interaction payload from Discord.
 */
// eslint-disable-next-line max-lines-per-function, max-statements -- This is a larger handler.
export const add: Command = async(lynira, interaction) => {
  try {
    const subscription = await getEntitlement(lynira, interaction.user.id);
    if (!subscription) {
      await sendUnentitledResponse(interaction);
      return;
    }
    const slug = interaction.options.getString("slug", true);
    if (reservedSlugs.includes(slug)) {
      await interaction.editReply({
        content: "This slug is reserved and cannot be used.",
      });
      return;
    }
    const url = interaction.options.getString("url", true);
    const isValidUrl = /^https?:\/\/(?:[\da-z-]+\.)+[a-z]{2,}(?:\/\S*)?$/i.test(
      url,
    );
    if (!isValidUrl) {
      await logger.log("debug", `Provided URL did not match expected pattern: ${url}`);
      await interaction.editReply({
        content: "The provided URL is not valid. Please provide a valid URL.",
      });
      return;
    }
    const slugExists = await lynira.db.links.findFirst({
      where: {
        slug,
      },
    });
    if (slugExists) {
      await interaction.editReply({
        content: "This slug is already in use. Please choose a different one.",
      });
      return;
    }
    const count = await lynira.db.links.count({
      where: {
        deleted: false,
        userId:  interaction.user.id,
      },
    });
    const limit = getSkuLimit(subscription.skuId);
    if (count >= limit) {
      await interaction.editReply({
        content: `You have reached your limit of ${limit.toString()} short URLs.`,
      });
      return;
    }
    await lynira.db.links.create({
      data: {
        slug:   slug,
        url:    url,
        userId: interaction.user.id,
      },
    });
    await interaction.editReply({
      content: `Short URL created. Visit <https://lynira.link/${slug}> to access it. Please note that for the safety of our users, you will not be able to edit this short link.`,
    });
    await logger.log(
      "info",
      `User ${interaction.user.id} created a short URL with slug "${slug}" pointing to "${url}".`,
    );
  } catch (error) {
    await errorHandler(error, "add command");
    await interaction.editReply({
      content:
        // eslint-disable-next-line stylistic/max-len -- Big boi string.
        "An error occurred while processing your request. Please try again later.",
    });
  }
};
