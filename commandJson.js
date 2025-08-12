import { ApplicationIntegrationType, InteractionContextType, SlashCommandBuilder } from "discord.js";

const about = new SlashCommandBuilder()
  .setName("about")
  .setDescription("Get information about this application.")
  .setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
  .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]);

const add = new SlashCommandBuilder()
    .setName("add")
    .setDescription("Add a new short URL.")
    .setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall])
    .addStringOption((option) =>
        option
            .setName("slug")
            .setDescription("The slug for the new short URL.")
            .setRequired(true)
            .setMaxLength(100),
    )
    .addStringOption((option) =>
        option
            .setName("url")
            .setDescription("The URL to shorten.")
            .setRequired(true)
            .setMaxLength(2000),
    )

const remove = new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove a short URL.")
    .setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall])
    .addStringOption((option) =>
        option
            .setName("slug")
            .setDescription("The slug for the short URL to remove.")
            .setRequired(true)
            .setMaxLength(100),
    )
const list = new SlashCommandBuilder()
    .setName("list")
    .setDescription("List your short URLs.")
    .setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall])

console.log(JSON.stringify([
    about.toJSON(),
    add.toJSON(),
    remove.toJSON(),
    list.toJSON(),
]));