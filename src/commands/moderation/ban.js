const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const { ContainerBuilder } = require("discord.js");
const notification = require("../../utils/notification");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a user from the server")
        .addUserOption(opt =>
            opt.setName("user").setDescription("User to ban").setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName("reason").setDescription("Reason").setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    settings: require("../../utils/settings")({
        permissions: [PermissionFlagsBits.BanMembers]
    }),

    async run(interaction) {
        await interaction.deferReply({ ephemeral: false });

        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason") ?? "No reason provided";

        const me = interaction.guild.members.me;

        if (!me.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.editReply(
                notification(
                    "I don't have permission to `BanMembers`.",
                    { ephemeral: true }
                )
            );
        }

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        if (member && member.roles.highest.position >= me.roles.highest.position) {
            return interaction.editReply(
                notification(
                    "I can't ban this user because their role is higher than or equal to mine...",
                    { ephemeral: true }
                )
            );
        }

        await interaction.guild.members.ban(user.id, { reason });

        const container = new ContainerBuilder()
            .addTextDisplayComponents(t =>
                t.setContent("`/home/meow/ban`")
            )
            .addSeparatorComponents(s => s)
            .addTextDisplayComponents(
                t => t.setContent(`**User:** ${user}`),
                t => t.setContent(`**Moderator:** ${interaction.user}`),
                t => t.setContent(`**Reason:** "${reason}"`)
            );

        await interaction.editReply({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};
