/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison -- We want this function to accept arbitrary SKU IDs. */

import { SKU } from "../interfaces/skus.js";

/**
 * Get the URL limit for a given SKU.
 * @param sku - The SKU to check.
 * @returns The URL limit for the SKU. Returns 0 if the SKU is not recognized.
 */
export const getSkuLimit = (sku: SKU | string): number => {
  if (sku === SKU.PERSONAL) {
    return 10;
  }
  if (sku === SKU.PROFESSIONAL) {
    return 25;
  }
  if (sku === SKU.BUSINESS) {
    return 100;
  }
  if (sku === SKU.ORGANISATION) {
    return 250;
  }
  if (sku === SKU.ENTERPRISE) {
    return 1000;
  }
  return 0;
};
