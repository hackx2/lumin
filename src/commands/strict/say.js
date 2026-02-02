const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { error } = require('../../utils/logger');

module.exports = class extends require('../~BaseCommand') {
    constructor() {
        super({ ownerOnly: true });

        this.data = new SlashCommandBuilder()
            .setName('say')
            .setDescription('Send a message as the bot')
            .addStringOption((opt) =>
                opt.setName('text').setDescription('Text to send').setRequired(true),
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
    }

    async run(interaction) {
        try {
            const text = interaction.options.getString('text');

            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
            await interaction.channel.send({ content: text });
            await interaction.deleteReply();
        } catch (err) {
            error(err);
        }
    }
};
