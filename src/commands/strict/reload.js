const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const notification = require('../../utils/notification');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reload Slash Commands...')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    settings: require('../../utils/settings')({
        ownerOnly: false,
        permissions: [PermissionFlagsBits.Administrator],
    }),

    async run(interaction, client) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        try {
            client.commands.clear();
            require('../../handlers/commands').run(client);
            await interaction.editReply(notification(';3 Slash commands reloaded!'));
        } catch (err) {
            console.error(err);
            await interaction.editReply(notification(':<  Failed to reload Slash commands.'));
        }
    },
};
