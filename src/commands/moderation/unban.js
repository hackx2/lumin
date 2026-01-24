const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { ContainerBuilder } = require('discord.js');
const notification = require('../../utils/notification');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user from the server')
        .addStringOption((opt) =>
            opt.setName('userid').setDescription('ID of the banned user').setRequired(true),
        )
        .addStringOption((opt) => opt.setName('reason').setDescription('Reason').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    settings: require('../../utils/settings')({
        permissions: [PermissionFlagsBits.BanMembers],
    }),

    async run(interaction) {
        await interaction.deferReply();

        const userId = interaction.options.getString('userid');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        let user;
        try {
            user = await interaction.client.users.fetch(userId);
        } catch (err) {
            return interaction.editReply(
                notification(`Failed to fetch user: \`${err.message}\``, {
                    ephemeral: true,
                }),
            );
        }

        const me = interaction.guild.members.me;

        if (!me.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.editReply(
                require('../../utils/notification')("I don't have permission to `BanMembers`.", {
                    ephemeral: true,
                }),
            );
        }

        try {
            await interaction.guild.members.unban(user.id, reason);
        } catch (err) {
            return interaction.editReply(
                notification(`Failed to unban user: \`${err.message}\``, {
                    ephemeral: true,
                }),
            );
        }

        const container = new ContainerBuilder()
            .addTextDisplayComponents((t) => t.setContent('`/home/lumin/unban`'))
            .addSeparatorComponents((s) => s)
            .addTextDisplayComponents((t) =>
                t.setContent(
                    [
                        `**User:** ${user.tag} (\`${user.id}\`)`,
                        `**Moderator:** ${interaction.user}`,
                        `**Reason:** "${reason}"`,
                    ].join('\n'),
                ),
            );

        await interaction.editReply({
            components: [container],
            flags: MessageFlags.IsComponentsV2,
        });
    },
};
