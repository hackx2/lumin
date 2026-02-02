const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { error, success } = require('../../utils/logger');
const CommandHandler = require('../../handlers/commands');

module.exports = class extends require('../~BaseCommand') {
    constructor() {
        super({ ownerOnly: true });

        this.data = new SlashCommandBuilder();
        this.data.setName('reload');
        this.data.setDescription('Reload Slash Commands...');
        this.data.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
    }

    async run(interaction, client) {
        await interaction.deferReply();

        try {
            client.commands.clear();

            new CommandHandler(client).run();

            success('Successfully reloaded * slash commands');

            await interaction.editReply(
                this.notification(`Successfully reloaded \`*\` slash commands 🌙`),
            );
        } catch (err) {
            error('Failed to reload * slash commands:', err);
            
            await interaction.editReply(
                this.notification('Failed to reload \`*\` slash commands: ' + err),
            );
        }
    }
};
