/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import { ContainerBuilder, TextDisplayBuilder } from "discord.js";
import type { Links } from "@prisma/client";

/**
 * Generates an array of components for displaying users' short URLs.
 * @param links - The array of links to display.
 * @returns An array of ContainerBuilder components.
 */
export const getLinkComponents
  = (links: Array<Links>): Array<ContainerBuilder> => {
    const components: Array<ContainerBuilder> = [];
    while (links.length > 0) {
      const slice = links.splice(0, 50);
      components.push(
        new ContainerBuilder().
          addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              slice.map((link) => {
                return `- \`${link.slug}\`: ${link.url}`;
              }).
                join("\n"),
            ),
          ),
      );
    }
    return components;
  };
