const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    MessageFlags,
    ContainerBuilder,
} = require('discord.js');

module.exports = class extends require('../~BaseCommand') {
    constructor() {
        super({
            permissions: [PermissionFlagsBits.BanMembers],
        });

        this.data = new SlashCommandBuilder()
            .setName('unban')
            .setDescription('Unban a user from the server')
            .addStringOption((opt) =>
                opt.setName('userid').setDescription('ID of the banned user').setRequired(true),
            )
            .addStringOption((opt) =>
                opt.setName('reason').setDescription('Reason').setRequired(false),
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);
    }

    async run(interaction) {
        await interaction.deferReply();

        const userId = interaction.options.getString('userid');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        let user;
        try {
            user = await interaction.client.users.fetch(userId);
        } catch (err) {
            return interaction.editReply(
                this.notification(`Failed to fetch user: \`${err.message}\``, { ephemeral: true }),
            );
        }

        const me = interaction.guild.members.me;

        if (!me.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.editReply(
                this.notification("I don't have permission to `BanMembers`.", { ephemeral: true }),
            );
        }

        try {
            await interaction.guild.members.unban(user.id, reason);
        } catch (err) {
            return interaction.editReply(
                this.notification(`Failed to unban user: \`${err.message}\``, { ephemeral: true }),
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
    }
};
