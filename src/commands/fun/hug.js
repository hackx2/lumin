const { SlashCommandBuilder, ContainerBuilder, MessageFlags } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = class extends require('../~BaseCommand') {
    constructor() {
        super({}, new SlashCommandBuilder());

        this.data.setName('hug');
        this.data.setDescription('Hug someone!');
        this.data.addUserOption((option) =>
            option.setName('cutie').setDescription('whose the lucky one?').setRequired(true),
        );
    }

    stage() {
        this.postsFile = path.join(__dirname, '../../assets/hug', 'hug.json');
        this.posts = JSON.parse(fs.readFileSync(this.postsFile, 'utf-8'));
    }

    async run(interaction) {
        const targetUser = interaction.options.getUser('cutie');
        const randomPost = this.posts[Math.floor(Math.random() * this.posts.length)];

        await interaction.deferReply();

        let postData;
        try {
            const imagePath = path.join(__dirname, '../../assets/hug', randomPost.id + '.png');
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
                this.notification(`:< Failed to load hug image ${randomPost.id}`),
            );
        }

        await interaction.editReply({
            files: [
                {
                    attachment: postData.buffer,
                    name: `hug-${postData.id}.png`,
                },
            ],
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents((txt) =>
                        txt.setContent(
                            `### <@!${interaction.user.id}> hugs <@!${targetUser.id}>! :crescent_moon:`,
                        ),
                    )
                    .addMediaGalleryComponents((gallery) =>
                        gallery.addItems((item) =>
                            item.setURL(`attachment://hug-${postData.id}.png`),
                        ),
                    )
                    .addTextDisplayComponents((txt) =>
                        txt.setContent(
                            `-# [View Post](https://e926.net/posts/${postData.id}) • by: ${postData.artists.join(', ')}`,
                        ),
                    ),
            ],
            flags: [MessageFlags.IsComponentsV2],
        });
    }
};
