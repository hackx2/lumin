const { SlashCommandBuilder, ContainerBuilder, MessageFlags } = require('discord.js');
const notification = require('../../utils/notification');

const postIDs = [6133811, 5237471, 4451477, 3187538];
const CACHE_WAIT = 1000 * 60 * 5; // 5minsss
const cache = new Map();

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

        let postData = cache.get(randomID);
        if (!postData || Date.now() - postData.fetchedAt > CACHE_WAIT) {
            try {
                const res = await fetch(`https://e926.net/posts.json?tags=id:${randomID}`, {
                    headers: { 'User-Agent': 'lumin/1.0 (by uni)' },
                });

                if (!res.ok) {
                    console.error(`Failed to fetch post ${res.status} ${randomID}`);
                    return interaction.editReply(
                        notification(':< failed to fetch hug img ' + randomID),
                    );
                }

                const post = (await res.json()).posts?.[0];
                if (!post?.file?.url) throw new Error('Post has no image');

                const imgRes = await fetch(post.file.url, {
                    headers: { 'User-Agent': 'lumin/1.0 (by uni)' },
                });
                if (!imgRes.ok) throw new Error(`Failed to fetch image ${imgRes.status}`);
                //const buffer = await imgRes.arrayBuffer();
                const arrayBuffer = await imgRes.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                postData = {
                    id: post.id,
                    imageUrl: post.file.url,
                    buffer,
                    artists: post.tags.artist.join(', ') || '???',
                    fetchedAt: Date.now(),
                };
                cache.set(randomID, postData);
            } catch (err) {
                console.error(err);
                return interaction.editReply(
                    notification(`:< Failed to fetch hug image ${randomID}`),
                );
            }
        }

        const container = new ContainerBuilder()
            .addTextDisplayComponents((txt) =>
                txt.setContent(
                    `### <@!${interaction.user.id}> hugs <@!${targetUser.id}>! :crescent_moon:`,
                ),
            )
            .addMediaGalleryComponents((gallery) =>
                gallery.addItems((item) => item.setURL(`attachment://hug-${postData.id}.png`)),
            )
            .addTextDisplayComponents((txt) =>
                txt.setContent(
                    `-# [View Post](https://e926.net/posts/${postData.id}) • [View Raw](${postData.imageUrl}) • by: ${postData.artists}`,
                ),
            );

        await interaction.editReply({
            files: [
                {
                    attachment: postData.buffer,
                    name: `hug-${postData.id}.png`,
                },
            ],
            components: [container],
            flags: [MessageFlags.IsComponentsV2],
        });
    }
};
