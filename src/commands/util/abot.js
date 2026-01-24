const { ContainerBuilder, SlashCommandBuilder, MessageFlags } = require('discord.js');
const osModule = require('../../utils/os');
const settings = require('../../utils/settings');

module.exports = {
    data: new SlashCommandBuilder().setName('abot').setDescription("lumin's bot information"),

    settings: settings({ cooldown: 5 }),

    async run(interaction, client) {
        const git = await require('../../utils/git')();

        const repoPath = git.repoURL.split('/').slice(-2).join('/').replace('.git', '');

        await interaction.reply({
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents((textDisplay) =>
                        textDisplay.setContent('`/home/lumin/abot`'),
                    )

                    .addSeparatorComponents((separator) => separator)

                    .addTextDisplayComponents(
                        (text) =>
                            text.setContent(
                                `**Ping:** ${client.ws.ping === -1 ? '`???`' : `${client.ws.ping}ms`}`,
                            ),
                        (text) => text.setContent(`**Uptime:** ${osModule.uptime}`),
                        (text) =>
                            text.setContent(
                                `**Operating System:** \`${osModule.platform} (${require('os').arch()})\``,
                            ),
                        (text) =>
                            text.setContent(
                                `**CPU:** \`${osModule.cpu.cpu.model}\` • Cores: \`${require('os').cpus().length}\` • Usage: \`${osModule.cpu.percent}%\``,
                            ),
                        (text) =>
                            text.setContent(
                                `**RAM:** \`${osModule.ram.used} / ${osModule.ram.total} MB\``,
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
    },
};
