const { MessageFlags } = require("discord.js");

module.exports = {
    run: async (_, interaction, settings) => {
        if (!settings.guildOnly) return true;

        if (!interaction.guild) {
            await interaction.reply(
                notification(':< This command can only be used in servers.', [MessageFlags.Ephemeral]),
            );
            return false;
        }

        return true;
    },
};
