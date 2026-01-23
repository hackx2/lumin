const notification = require("../notification");

module.exports = {
    run: async (client, interaction, settings) => {
        if (!settings.ownerOnly) return true;

        const owners = client.owners ?? [];

        if (!owners.includes(interaction.user.id)) {
            await interaction.reply(notification(":< This command is owner-only.", { ephemeral: true }));
            return false;
        }

        return true;
    }
};
