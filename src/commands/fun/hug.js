const { SlashCommandBuilder, ContainerBuilder, MessageFlags } = require('discord.js');
const notification = require('../../utils/notification');
const fs = require('fs');
const path = require('path');

const postsFile = path.join(__dirname, './hug.json');
const posts = JSON.parse(fs.readFileSync(postsFile, 'utf-8'));

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
        const randomPost = posts[Math.floor(Math.random() * posts.length)];

        let postData = cache.get(randomPost.id);

        if (!postData || Date.now() - postData.fetchedAt > CACHE_WAIT) {
            try {
                const res = await fetch(randomPost.url, {
                    headers: { 'User-Agent': 'lumin/1.0 (by uni)' },
                });

                if (!res.ok) throw new Error(`Failed to fetch image ${res.status}`);
                //const buffer = await imgRes.arrayBuffer();
                const arrayBuffer = await res.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                postData = {
                    ...randomPost,
                    buffer,
                    fetchedAt: Date.now(),
                };

                cache.set(randomPost.id, postData);
            } catch (err) {
                console.error(err);
                return interaction.editReply(
                    notification(`:< Failed to fetch hug image ${randomPost.id}`),
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
                    `-# [View Post](https://e926.net/posts/${postData.id}/)  • [View Raw](${postData.url}) • by: ${postData.artists.join(', ')}`,
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
