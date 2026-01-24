const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const settings = require('../../utils/settings');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('nuh uh')
        .addStringOption((opt) => opt.setName('text').setDescription('mrrp').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    settings: settings({ ownerOnly: true }),

    async run(interaction, _) {
        const text = interaction.options.getString('text');

        try {
            await interaction.deferReply({ ephemeral: true });
            await interaction.channel.send({ content: text });
            await interaction.deleteReply();
        } catch (err) {
            console.error(err);
        }
    },
};
