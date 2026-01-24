const { MessageFlags } = require('discord.js');
const notification = require('../notification');

module.exports = {
    run: async (_, interaction, settings) => {
        if (!settings.permissions?.length) return true;
        for (const permission of settings.permissions) {
            if (!interaction.memberPermissions?.has(permission)) {
                await interaction.reply(
                    notification('You do not have permission to execute this command..', {
                        ephemeral: true,
                    }),
                );
                return false;
            }
        }
        return true;
    },
};
