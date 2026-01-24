const { SlashCommandBuilder, ContainerBuilder, MessageFlags } = require('discord.js');
const notification = require('../../utils/notification');

const postIDs = [6133811, 5237471, 4451477, 3187538];

module.exports = class extends require('../~BaseCommand') {
    constructor() {
        super({});
        this.data = new SlashCommandBuilder()
            .setName('hug')
            .setDescription('Hug someone!')
            .addUserOption((opt) =>
                opt.setName('cutie').setDescription('whose the lucky one?').setRequired(true),
            );
    }

    async run(interaction) {
        await interaction.deferReply();

        const targetUser = interaction.options.getUser('cutie');
        const randomID = postIDs[Math.floor(Math.random() * postIDs.length)];

        const res = await fetch(`https://e926.net/posts.json?tags=id:${randomID}`, {
            headers: { 'User-Agent': 'lumin/1.0 (by uni)' },
        });

        if (!res.ok) {
            console.error(`Failed to fetch post ${res.status} ${randomID}`);
            return interaction.editReply(notification(':< failed to fetch hug img '+ randomID));
        }

        const post = (await res.json()).posts?.[0];
        if (!post?.file?.url) return interaction.editReply(notification(':< Post has no image'));

        const imageUrl = post.file.url;
        const artists = post.tags.artist.join(', ') || '???';

        const container = new ContainerBuilder()
            .addTextDisplayComponents((txt) =>
                txt.setContent(
                    `### <@!${interaction.user.id}> hugs <@!${targetUser.id}>! :crescent_moon:`,
                ),
            )
            .addMediaGalleryComponents((gallery) =>
                gallery.addItems((item) => item.setURL(imageUrl)),
            )
            .addTextDisplayComponents((txt) =>
                txt.setContent(
                    `-# [View Post](https://e926.net/posts/${post.id}) • [View Raw](${imageUrl}) • by: ${artists}`,
                ),
            );

        await interaction.editReply({
            components: [container],
            flags: [MessageFlags.IsComponentsV2],
        });
    }
};
