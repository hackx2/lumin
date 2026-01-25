const vm = require('vm');
const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = class extends require('../~BaseCommand') {
    constructor() {
        super({ ownerOnly: true });

        this.data = new SlashCommandBuilder()
            .setName('eval')
            .setDescription('eval stuffs')
            .addStringOption((option) =>
                option.setName('code').setDescription('code?').setRequired(true),
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
    }

    async run(interaction, client) {
        const code = interaction.options.getString('code');

        try {
            const result = vm.runInNewContext(code, {
                client,
                console,
                interaction,
                discordjs: require("discord.js")
            });

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
