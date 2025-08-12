/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import type { PrismaClient } from "@prisma/client";
import type { Client } from "discord.js";

export interface Lynira {
  discord: Client;
  db:      PrismaClient;
}
