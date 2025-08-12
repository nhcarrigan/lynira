/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import { type Entitlement, EntitlementType } from "discord.js";
import { SKU } from "../interfaces/skus.js";
import type { Lynira } from "../interfaces/lynira.js";

/**
 * Fetches an entitlement for a user. Only looks at the first ACTIVE entitlement.
 * @param lynira - Lynira's Discord instance.
 * @param userId - The ID of the user to fetch the entitlement for.
 * @returns The entitlement if found, or null if not found.
 */
export const getEntitlement = async(
  lynira: Lynira,
  userId: string,
): Promise<Entitlement | null> => {
  if (userId === "465650873650118659") {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Mock entitlement for Naomi.
    return {
      applicationId: lynira.discord.application?.id ?? "",
      consumed:      false,
      deleted:       false,
      endsAt:        null,
      endsTimestamp: null,
      guild:         null,
      guildId:       null,
      id:            "enterprise-entitlement-id",
      isActive:      () => {
        return true;
      },
      skuId:           SKU.ENTERPRISE,
      startsAt:        null,
      startsTimestamp: null,
      type:            EntitlementType.ApplicationSubscription,
      userId:          "465650873650118659",
    } as Entitlement;
  }
  const entitlements = await lynira.discord.application?.entitlements.fetch({
    excludeDeleted: true,
    excludeEnded:   true,
    user:           userId,
  }).catch(() => {
    return null;
  });

  return entitlements?.first() ?? null;
};
