const { SlashCommandBuilder, ContainerBuilder, MessageFlags } = require('discord.js');
const notification = require('../../utils/notification');
const fs = require('fs');
const path = require('path');

const postsFile = path.join(__dirname, './hug.json');
const posts = JSON.parse(fs.readFileSync(postsFile, 'utf-8'));

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

        let postData;
        try {
            const imagePath = path.join(__dirname, './hug', randomPost.id + '.png');
            if (!fs.existsSync(imagePath)) throw new Error(`img file not found: ${imagePath}`);

            const buffer = fs.readFileSync(imagePath);

            postData = {
                ...randomPost,
                buffer,
                fetchedAt: Date.now(),
            };
        } catch (err) {
            console.error(err);
            return interaction.editReply(
                notification(`:< Failed to load hug image ${randomPost.id}`),
            );
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
                    `-# [View Post](https://e926.net/posts/${postData.id}) • by: ${postData.artists.join(', ')}`,
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
