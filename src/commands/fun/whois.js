const { SlashCommandBuilder, ContainerBuilder, MessageFlags } = require('discord.js');
const settings = require('../../utils/settings');

module.exports = class extends require('../~BaseCommand') {
    constructor() {
        super({ cooldown: 5 });

        this.data = new SlashCommandBuilder()
            .setName('whois')
            .setDescription('Show detailed info about a user')
            .addUserOption((option) =>
                option
                    .setName('user')
                    .setDescription('User to view (defaults to yourself)')
                    .setRequired(false),
            );

        this.settings = settings({ cooldown: 5 });
    }

    async run(interaction) {
        // This'll give us some time to render the reply...
        await interaction.deferReply();

        const baseUser = interaction.options.getUser('user') || interaction.user;

        const user = await interaction.client.users.fetch(baseUser.id, {
            force: true,
        });
        const member = interaction.guild?.members.cache.get(user.id) ?? null;

        const avatarURL = user.displayAvatarURL({ size: 2048, dynamic: true });
        const bannerURL = user.bannerURL({ size: 2048 });

        const bannerRender = await require('../../utils/iconBanner')({ avatarURL, bannerURL });

        const accentColor = user.accentColor
            ? `#${user.accentColor.toString(16).padStart(6, '0')}`
            : null;
        const decorationURL = user.avatarDecorationData?.asset
            ? `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatarDecorationData.asset}.png`
            : null;
        const badges = user.flags?.toArray() || [];
        const viewing = [
            `[View Avatar](${avatarURL})`,
            bannerURL ? `[View Banner](${bannerURL})` : null,
            decorationURL ? `[View Decoration](${decorationURL})` : null,
            bannerRender.id,
        ]
            .filter(Boolean)
            .join(' • ');

        await interaction.editReply({
            files: [
                {
                    attachment: bannerRender.buffer,
                    name: 'banner.png',
                },
            ],
            components: [
                new ContainerBuilder()
                    .addMediaGalleryComponents((gallery) => {
                        gallery.addItems((item) => item.setURL('attachment://banner.png'));
                        return gallery;
                    })
                    .addSeparatorComponents((separator) => separator)
                    .addTextDisplayComponents((txt) =>
                        txt.setContent(`### ${user.globalName ?? user.username} (<@${user.id}>)`),
                    )
                    .addTextDisplayComponents((txt) =>
                        txt.setContent(
                            [
                                `**ID:** \`${user.id}\``,
                                member
                                    ? `**Joined Server:** <t:${Math.floor(member.joinedTimestamp / 1000)}:R>`
                                    : null,
                                `**Account Created:** <t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
                                badges.length ? `**Badges:** \`${badges.join('`, `')}\`` : null,
                                accentColor
                                    ? `**Accent Color:** \`${accentColor}\` [view](https://www.color-hex.com/color/${accentColor.replace('#', '')})`
                                    : null,
                                member && member.roles
                                    ? `**Roles:** ${
                                          member.roles.cache
                                              .map((r) => r.name)
                                              .filter((n) => n !== '@everyone')
                                              .map((n) => `\`${n}\``)
                                              .join(', ') || 'None'
                                      }`
                                    : null,
                            ]
                                .filter(Boolean)
                                .join('\n'),
                        ),
                    )
                    .addSeparatorComponents((s) => s)
                    .addTextDisplayComponents((txt) => txt.setContent('-# ' + viewing)),
            ],
            flags: [MessageFlags.IsComponentsV2],
        });
    }
};
