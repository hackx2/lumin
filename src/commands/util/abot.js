const { ContainerBuilder, SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = class extends require('../~BaseCommand') {
    constructor() {
        super({ cooldown: 5 });

        this.data = new SlashCommandBuilder()
            .setName('abot')
            .setDescription("lumin's bot information");
    }

    async run(interaction, client) {
        const osUtility = require('../../utils/os');
        const git = await require('../../utils/git')();

        const repoPath = git.repoURL.split('/').slice(-2).join('/').replace('.git', '');

        await interaction.reply({
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents((textDisplay) =>
                        textDisplay.setContent('`fas/home/lumin/abot`'),
                    )

                    .addSeparatorComponents((separator) => separator)

                    .addTextDisplayComponents(
                        (text) =>
                            text.setContent(
                                `**Ping:** ${client.ws.ping === -1 ? '`???`' : `${client.ws.ping}ms`}`,
                            ),
                        (text) => text.setContent(`**Uptime:** ${osUtility.uptime}`),
                        (text) =>
                            text.setContent(
                                `**Operating System:** \`${osUtility.platform} (${require('os').arch()})\``,
                            ),
                        (text) =>
                            text.setContent(
                                `**CPU:** \`${osUtility.cpu.cpu.model}\` • Cores: \`${require('os').cpus().length}\` • Usage: \`${osUtility.cpu.percent}%\``,
                            ),
                        (text) =>
                            text.setContent(
                                `**RAM:** \`${osUtility.ram.used} / ${osUtility.ram.total} MB\``,
                            ),
                    )

                    .addSeparatorComponents((separator) => separator)

                    .addTextDisplayComponents((text) =>
                        text.setContent(
                            `**Versions:** Node.js \`${process.version}\` • Discord.js \`${require('discord.js').version}\`\n` +
                                `**Repository:** [${repoPath}](${git.repoURL}) ([${git.commitHash}](${git.repoURL.replace('.git', '')}/commit/${git.commitHash}))\n`,
                        ),
                    )
                    .addSeparatorComponents((separator) => separator)

                    .addTextDisplayComponents((text) =>
                        text.setContent(`-# written & hosted by: uni@meow (<@707228048864444477>)`),
                    ),
            ],
            flags: MessageFlags.IsComponentsV2,
        });
    }
};
