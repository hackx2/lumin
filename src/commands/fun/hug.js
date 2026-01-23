const { SlashCommandBuilder, ContainerBuilder, MediaGalleryBuilder, MessageFlags } = require("discord.js");
const notification = require("../../utils/notification");

const postIDs = [6133811, 5237471, 4451477, 3187538];

module.exports = {
    data: new SlashCommandBuilder().setName("hug")
    .setDescription("Hug someone!")
    .addUserOption(opt => opt.setName("cutie")
    .setDescription("who do you want to hug? :3").setRequired(true)),

    async run(interaction) {
        await interaction.deferReply();

        try {
            const targetUser = interaction.options.getUser("cutie");

            const randomID = postIDs[Math.floor(Math.random() * postIDs.length)];
            const res = await fetch(`https://e926.net/posts.json?tags=id:${randomID}`, {
                headers: { "User-Agent": "lumin" }
            });

            if (!res.ok) throw new Error(`:< failed to fetch post ${res.status}`);

            const json = await res.json();
            const post = json.posts?.[0];
            if (!post?.file?.url) throw new Error("Post has no image");

            const imageUrl = post.file.url;
            const artists= post.tags.artist.join(', ');
            await interaction.editReply({
                components: [new ContainerBuilder()
                    .addTextDisplayComponents(txt =>
                        txt.setContent(`### <@!${interaction.user.id}> hugs <@!${targetUser.id}>! :crescent_moon:`)
                    ).addMediaGalleryComponents(gallery =>
                        gallery.addItems(item => item.setURL(imageUrl))
                    ).addTextDisplayComponents(txt =>
                        txt.setContent(`-# [View Post](https://e926.net/posts/${post.id}) • [View Raw](${imageUrl}) • by: ${artists.length <= 0 ? '???' : artists}`
                        )
                    )
                ],
                flags: [MessageFlags.IsComponentsV2],
            });

        } catch (err) {
            console.error(err);
            await interaction.editReply(notification(":<  failed to fetch hug img"));
        }
    }
};
