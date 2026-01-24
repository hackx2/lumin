module.exports = {
    run: async (_, interaction, settings) => {
        if (!settings.guildOnly) return true;

        if (!interaction.guild) {
            await interaction.reply(
                notification(':< This command can only be used in servers.', { ephemeral: true }),
            );
            return false;
        }

        return true;
    },
};
