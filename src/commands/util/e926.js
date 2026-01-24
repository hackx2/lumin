const { SlashCommandBuilder, ContainerBuilder, MessageFlags } = require('discord.js');
const notification = require('../../utils/notification');

module.exports = class extends require('../~BaseCommand') {
    constructor() {
        super({ cooldown: 5 });

        this.data = new SlashCommandBuilder()
            .setName('e926')
            .setDescription("Get random art from e926's api")
            .addStringOption((opt) =>
                opt.setName('tags').setDescription('(optional) tags (space separated)'),
            );
    }

    async run(interaction) {
        const tagString = interaction.options.getString('tags') ?? '';
        const tags = tagString.split(' ').filter(Boolean);

        await interaction.deferReply();

        try {
            const params = new URLSearchParams({
                tags: ['rating:s', ...tags].join(' '),
            });

            const res = await fetch(`https://e926.net/posts/random.json?${params}`, {
                headers: {
                    'User-Agent': 'lumin',
                },
            });

            if (!res.ok) throw new Error('oops...');

            const { post } = await res.json();

            if (!post?.file?.url) {
                await interaction.editReply(notification(':<  No image found'));
                return;
            }

            await interaction.editReply({
                components: [
                    new ContainerBuilder()
                        .addMediaGalleryComponents((gallery) =>
                            gallery.addItems((item) => item.setURL(post.file.url)),
                        )
                        .addTextDisplayComponents((txt) =>
                            txt.setContent(
                                `-# [View Post](https://e926.net/posts/${post.id}) • [View Original](${post.file.url}) • by: ${post.tags.artist.join(', ')}`,
                            ),
                        ),
                ],
                flags: [MessageFlags.IsComponentsV2],
            });
        } catch (err) {
            console.error(err);
            await interaction.editReply(notification(':<  Failed to fetch art'));
        }
    }
};
