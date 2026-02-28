const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { error, success } = require('../../utils/logger');
const CommandHandler = require('../../handlers/commands');

module.exports = class extends require('../~BaseCommand') {
    constructor() {
        super({ ownerOnly: true, prefixed: 'PREFIXED' });
        this.data = new SlashCommandBuilder().setName('reload')
    }

    async run(interaction, client, args, slash = true) {
        if (slash) await interaction.deferReply();

        const responder = async (content) => {
            const payload = this.notification(content);
            return slash ? interaction.editReply(payload) : interaction.reply(payload);
        };

        try {
            client.commands.clear();
            await new CommandHandler(client).run();

            success('Successfully reloaded * slash commands');
            await responder(`Successfully reloaded \`*\` slash commands 🌙`);
        } catch (err) {
            error('Failed to reload * slash commands:', err);
            await responder('Failed to reload \`*\` slash commands: ' + err);
        }
    }
};
