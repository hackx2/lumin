const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

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

            await interaction.deferReply({ ephemeral: true });
            await interaction.channel.send({ content: text });
            await interaction.deleteReply();
        } catch (err) {
            console.error(err);
        }
    }
};
