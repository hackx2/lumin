const vm = require('vm');
const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { execSync } = require('child_process');

module.exports = class extends require('../~BaseCommand') {
    constructor() {
        super({ ownerOnly: true });

        this.data = new SlashCommandBuilder()
            .setName('exec')
            .setDescription('exec stuffs')
            .addStringOption((option) =>
                option.setName('code').setDescription('code?').setRequired(true),
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
    }

    async run(interaction, client) {
        const code = interaction.options.getString('code');

        try {
            const result = execSync(code, { timeout: 1000 });

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: `Result:\n\`\`\`js\n${String(result)}\n\`\`\``,
                    flags: [MessageFlags.Ephemeral],
                });
            } else {
                await interaction.editReply({
                    content: `Result:\n\`\`\`js\n${String(result)}\n\`\`\``,
                });
            }
        } catch (err) {
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: `Error:\n\`\`\`${err.message}\`\`\``,
                    flags: [MessageFlags.Ephemeral],
                });
            } else {
                await interaction.editReply({
                    content: `Error:\n\`\`\`${err.message}\`\`\``,
                });
            }
        }
    }
};
