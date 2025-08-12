/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import fastify from "fastify";
import { getEntitlement } from "../modules/getEntitlement.js";
import { getSkuLimit } from "../modules/getSkuLimit.js";
import { logger } from "../utils/logger.js";
import { error } from "./html/error.js";
import { fourOhFour } from "./html/fourOhFour.js";
import { home } from "./html/home.js";
import { overlimit } from "./html/overlimit.js";
import { unsub } from "./html/unsub.js";
import type { Lynira } from "../interfaces/lynira.js";

/**
 * Starts up a web server for health monitoring.
 * @param lynira - Lynira's instance containing Discord client and database connection.
 */
// eslint-disable-next-line max-lines-per-function -- Big function due to multiple routes.
export const instantiateServer = (lynira: Lynira): void => {
  try {
    const server = fastify({
      logger: false,
    });

    server.get("/", (_request, response) => {
      response.header("Content-Type", "text/html");
      response.send(home);
    });

    server.get("/error", (_request, response) => {
      response.header("Content-Type", "text/html");
      response.send(error);
    });

    server.get("/unsub", (_request, response) => {
      response.header("Content-Type", "text/html");
      response.send(unsub);
    });

    server.get("/overlimit", (_request, response) => {
      response.header("Content-Type", "text/html");
      response.send(overlimit);
    });

    server.get("/404", (_request, response) => {
      response.status(404);
      response.header("Content-Type", "text/html");
      response.send(fourOhFour);
    });

    // WILDCARD: anything static must come before this route.
    // eslint-disable-next-line max-statements -- Big function due to multiple routes.
    server.get("*", async(request, response) => {
      try {
        const slug = request.url.replace(/^\//, "");

        const exists = await lynira.db.links.findUnique({
          where: {
            slug,
          },
        });

        if (exists === null) {
          void logger.log("debug", `Link with slug "${slug}" does not exist.`);
          return await response.redirect("/404");
        }

        if (exists.deleted) {
          void logger.log("debug", `Link with slug "${slug}" has been deleted.`);
          return await response.redirect("/404");
        }

        const subscription = await getEntitlement(lynira, exists.userId);

        if (!subscription) {
          void logger.log("info", `User ${exists.userId} is not subscribed to Lynira, slug ${slug} will not work.`);
          return await response.redirect("/unsub");
        }

        const limit = getSkuLimit(subscription.skuId);

        const count = await lynira.db.links.count({
          where: {
            userId: exists.userId,
          },
        });

        if (count >= limit) {
          await logger.log("info", `User ${exists.userId} is on SKU ${subscription.skuId} and has reached ${count.toString()} / ${limit.toString()} links.`);
          return await response.redirect("/overlimit");
        }

        return await response.redirect(exists.url);
      } catch (actualError) {
        if (actualError instanceof Error) {
          void logger.error("server wildcard route", actualError);
          return await response.redirect("/error");
        }
        void logger.error(
          "server wildcard route",
          new Error(String(actualError)),
        );
        return await response.redirect("/error");
      }
    });

    server.listen({ port: 5044 }, (actualError) => {
      if (actualError) {
        void logger.error("instantiate server", actualError);
        return;
      }
      void logger.log("debug", "Server listening on port 5044.");
    });
  } catch (actualError) {
    if (actualError instanceof Error) {
      void logger.error("instantiate server", actualError);
      return;
    }
    void logger.error("instantiate server", new Error(String(actualError)));
  }
};
