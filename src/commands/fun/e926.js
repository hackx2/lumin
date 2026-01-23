const { SlashCommandBuilder, ContainerBuilder, MessageFlags } = require("discord.js");
const settings = require("../../utils/settings");
const notification = require("../../utils/notification");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("e926")
        .setDescription("Get random art from e926's api")
        .addStringOption(opt => opt.setName("tags").setDescription("(optional) tags (space separated)")),

    settings: settings({ cooldown: 5 }),

    async run(interaction) {
        const tagString = interaction.options.getString("tags") ?? "";
        const tags = tagString.split(" ").filter(Boolean);

        await interaction.deferReply();

        try {

            const params = new URLSearchParams({
                tags: ["rating:s", ...tags].join(" "),
            });

            const res = await fetch(`https://e926.net/posts/random.json?${params}`, {
                headers: {
                    "User-Agent": "lumin",
                },
            });

            if (!res.ok) throw new Error("oops...");

            const { post } = await res.json();

            if (!post?.sample?.url) {
                await interaction.editReply(notification(":<  No image found"));
            }

            await interaction.editReply({
                components: [
                    new ContainerBuilder().addMediaGalleryComponents(
                        gallery => gallery.addItems(item => item.setURL(post?.sample?.url).setDescription(`Sample Image`)
                        )).addTextDisplayComponents(txt =>
                            txt.setContent(`-# [View Post](https://e926.net/posts/${post.id}) • [View Original](${post.file.url}) • by: ${post.tags.artist.join(', ')}`
                            )
                        )
                ],
                flags: [MessageFlags.IsComponentsV2],
            });
        } catch (err) {
            console.error(err);
            await interaction.editReply(notification(":<  Failed to fetch art"));
        }
    },
};
