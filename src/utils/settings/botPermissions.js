module.exports = {
    run: async (_, interaction, settings) => {
        if (!settings.botPermissions?.length || !interaction.guild) return true;

        const botMember = interaction.guild.members.me;
        
        if (botMember.permissions.missing(settings.botPermissions).length) {
            await interaction.reply(notification(`:< I am missing permissions:\n${missing.join(", ")}`, { ephemeral: true }));
            return false;
        }

        return true;
    }
};
