const vm = require("vm");
const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("eval").setDescription("eval code")
        .addStringOption(option => option.setName("code").setDescription("Code to evaluate").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    settings: require("../../utils/settings")({ ownerOnly: true }),

    async run(interaction, client) {
        const code = interaction.options.getString("code");

        try {
            const evalVM = vm.runInNewContext(code, {
                client,
                console,
                interaction
            });

            await interaction.reply({
                content: `Result:\n\`\`\`js\n${String(evalVM)}\n\`\`\``,
                flags: [MessageFlags.Ephemeral]
            });
        } catch (err) {
            await interaction.reply({
                content: `Error:\n\`\`\`${err.message}\`\`\``,
                flags: [MessageFlags.Ephemeral]
            });
        }
    }
};
