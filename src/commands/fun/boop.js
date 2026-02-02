const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = class extends require('../~BaseCommand') {
    constructor() {
        super();

        this.data = new SlashCommandBuilder();
        this.data.setName('boop').setDescription('boop a cutie ^w^');
        this.data.addUserOption((option) =>
            option.setName('cutie').setDescription('who are you going to boop?').setRequired(true),
        );
    }

    async run(interaction) {
        const targetID = interaction.options.getUser('cutie').id;
        const authorID = interaction.user.id;

        if (targetID == authorID) {
            await interaction.reply(
                this.notification("You can't boop yourself :<", [MessageFlags.Ephemeral]),
            );

            return;
        }

        await interaction.reply(this.notification(`<@!${authorID}> booped <@!${targetID}>! ><`));
    }
};
