const { SlashCommandBuilder, PermissionFlagsBits} = require("discord.js");
const settings = require("../../utils/settings");
const notification = require("../../utils/notification");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Reload slash commands")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), 

    settings: settings({ ownerOnly: true }),

    async run(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        try {
            client.commands.clear();
            require("../../handlers/commands").run(client);
            await interaction.editReply(notification(";3 Slash commands reloaded!"));
        } catch (err) {
            console.error(err);
            await interaction.editReply(notification(":<  Failed to reload Slash commands."));
        }
    },
};
