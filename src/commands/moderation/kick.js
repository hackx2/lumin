const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    MessageFlags,
    ContainerBuilder,
} = require('discord.js');

module.exports = class extends require('../~BaseCommand') {
    constructor() {
        super({
            permissions: [PermissionFlagsBits.KickMembers],
        });

        this.data = new SlashCommandBuilder()
            .setName('kick')
            .setDescription('Kick a user from the server')
            .addUserOption((opt) =>
                opt.setName('user').setDescription('User to kick').setRequired(true),
            )
            .addStringOption((opt) =>
                opt.setName('reason').setDescription('Reason').setRequired(false),
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);
    }

    async run(interaction) {
        await interaction.deferReply({ ephemeral: false });

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        const me = interaction.guild.members.me;

        if (!me.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.editReply(
                this.notification("I don't have permission to `KickMembers`.", { ephemeral: true }),
            );
        }

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        if (member && member.roles.highest.position >= me.roles.highest.position) {
            return interaction.editReply(
                this.notification(
                    "I can't ban this user because their role is higher than or equal to mine...",
                    { ephemeral: true },
                ),
            );
        }

        try {
            await interaction.guild.members.kick(user.id, { reason });
        } catch (err) {
            return interaction.editReply(
                this.notification(`Failed to kick user: \`${err.message}\``, { ephemeral: true }),
            );
        }

        const container = new ContainerBuilder()
            .addTextDisplayComponents((t) => t.setContent('`/home/lumin/kick`'))
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
    }
};
