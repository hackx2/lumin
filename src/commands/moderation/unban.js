const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const { ContainerBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unban a user from the server")
        .addStringOption(opt =>
            opt.setName("userid")
                .setDescription("ID of the banned user")
                .setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName("reason")
                .setDescription("Reason")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    settings: require("../../utils/settings")({
        permissions: [PermissionFlagsBits.BanMembers]
    }),

    async run(interaction) {
        await interaction.deferReply(); 

        const userId = interaction.options.getString("userid");
        const reason = interaction.options.getString("reason") ?? "No reason provided";

        const user = await interaction.client.users.fetch(userId);

        const me = interaction.guild.members.me;

        if (!me.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.editReply(
                notification(
                    "I don't have permission to `BanMembers`.",
                    { ephemeral: true }
                )
            );
        }

        await interaction.guild.members.unban(userId, reason);

        const container = new ContainerBuilder()
            .addTextDisplayComponents(t =>
                t.setContent("`/home/meow/unban`")
            )
            .addSeparatorComponents(s => s)
            .addTextDisplayComponents(
                t => t.setContent(`**User:** ${user.tag} (\`${user.id}\`)`),
                t => t.setContent(`**Moderator:** ${interaction.user}`),
                t => t.setContent(`**Reason:** "${reason}"`)
            );

        await interaction.editReply({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};
