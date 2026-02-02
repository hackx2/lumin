const { MessageFlags } = require('discord.js');

module.exports = {
    run: async (_, interaction, settings) => {
        if (!settings.userPermissions?.length) return true;

        if (interaction.member.permissions.missing(settings.userPermissions).length) {
            await interaction.reply(
                notification(`:< You are missing permissions:\n${missing.join(', ')}`, [
                    MessageFlags.Ephemeral,
                ]),
            );
            return false;
        }

        return true;
    },
};
