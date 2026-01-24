const { SlashCommandBuilder, ContainerBuilder, MessageFlags } = require('discord.js');
const settings = require('../../utils/settings');
const notification = require('../../utils/notification');

module.exports = class extends require('../~BaseCommand') {
    constructor() {
        super({ cooldown: 3 });

        this.data = new SlashCommandBuilder()
            .setName('cat')
            .setDescription('KITTAYY!!!');
    }

    async run(interaction) {
        await interaction.deferReply(); // grr..

        try {
            const res = await fetch('https://cataas.com/cat?json=true');
            if (!res.ok) throw new Error("couldn't fetch da cutie :< ");

            const cat = await res.json();

            await interaction.editReply({
                components: [
                    new ContainerBuilder()
                        .addMediaGalleryComponents((gallery) =>
                            gallery.addItems((item) =>
                                item
                                    .setURL(cat.url)
                                    .setDescription('mrrp!! @ cataas.com'),
                            ),
                        )
                        // .addTextDisplayComponents((txt) =>
                        //     txt.setContent(
                        //         `-# \`${cat.tags?.length
                        //             ? `Tags: ${cat.tags.join(', ')}`
                        //             : 'No tags'}\``,
                        //     ),
                        // ),
                ],
                flags: [MessageFlags.IsComponentsV2],
            });
        } catch (err) {
            console.error(err);
            await interaction.editReply(notification(":< couldn't find a kitty QwQ"));
        }
    }
};
