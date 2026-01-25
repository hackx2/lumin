const { SlashCommandBuilder, ContainerBuilder, MessageFlags } = require('discord.js');

module.exports = class extends require('../~BaseCommand') {
    constructor() {
        super({ cooldown: 3 });
        this.data = new SlashCommandBuilder().setName('cat').setDescription('KITTAYY!!!');
    }

    async run(interaction) {
        await interaction.deferReply();

        try {
            const res = await fetch('https://api.thecatapi.com/v1/images/search');
            if (!res.ok) throw new Error("couldn't fetch da cutie :<");

            const cats = await res.json();
            const cat = cats[0];

            await interaction.editReply({
                components: [
                    new ContainerBuilder().addMediaGalleryComponents((gallery) =>
                        gallery.addItems((item) => item.setURL(cat.url)),
                    ),
                ],
                flags: [MessageFlags.IsComponentsV2],
            });
        } catch (err) {
            console.error(err);
            await interaction.editReply(this.notification(":< couldn't find a kitty QwQ"));
        }
    }
};
