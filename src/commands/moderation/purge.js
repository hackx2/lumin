const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    MessageFlags,
    ContainerBuilder,
} = require('discord.js');

module.exports = class extends require('../~BaseCommand') {
    constructor() {
        super({
            permissions: [PermissionFlagsBits.ManageMessages],
        });

        this.data = new SlashCommandBuilder()
            .setName('purge')
            .setDescription('Purge messages.')
            .addIntegerOption((opt) =>
                opt.setName('amount').setDescription('How many messages.').setRequired(true),
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);
    }

    async run(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const purgeAmount = interaction.options.getInteger('amount');

        try {
            const deletedMessages = await interaction.channel.bulkDelete(purgeAmount, true);
            const count = deletedMessages.size;

            await interaction.editReply({
                components: [
                    new ContainerBuilder()
                        .addTextDisplayComponents((t) => t.setContent('`/home/lumin/purge`'))
                        .addSeparatorComponents((s) => s)
                        .addTextDisplayComponents((t) =>
                            t.setContent(`Successfully purged ${count} messages.`),
                        ),
                ],
                flags: MessageFlags.IsComponentsV2,
            });
        } catch (error) {
            console.error(error);
            await interaction.editReply(this.notification('There was an error trying to purge messages in this channel!\n(Messages older than 14 days cannot be bulk deleted).'));
        }
    }
};
