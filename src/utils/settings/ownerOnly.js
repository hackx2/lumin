const notification = require('../notification');

module.exports = {
    run: async (client, interaction, settings) => {
        if (!settings.ownerOnly) return true;

        const owners = client.owners ?? [];

        if (!owners.includes(interaction.user.id)) {
            await interaction.reply(
                notification(
                    'You do not have permission to execute this command..' /*:< This command is owner-only."*/,
                    { ephemeral: true },
                ),
            );
            return false;
        }

        return true;
    },
};
