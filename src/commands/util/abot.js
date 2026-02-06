const { ContainerBuilder, SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = class extends require('../~BaseCommand') {
    #path; // Repository Path
    #os = require('../../utils/os'); // OS Information
    #git = require('../../utils/git'); // Git Data Instance

    constructor() {
        super({ cooldown: 5 });

        this.data = new SlashCommandBuilder();
        this.data.setName('abot');
        this.data.setDescription("lumin's bot information");

        (async () => {
            this.#git = await this.#git();
            this.#path = this.#git.repoURL.split('/').slice(-2).join('/').replace('.git', '');
        })();
    }

    async run(interaction, client) {
        await interaction.reply({
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents((textDisplay) =>
                        textDisplay.setContent('`/home/lumin/abot`'+` | \`v${process.lumin.metadata.version}\``),
                    )

                    .addSeparatorComponents((separator) => separator)

                    .addTextDisplayComponents(
                        (text) =>
                            text.setContent(
                                `**Ping:** ${client.ws.ping === -1 ? '`???`' : `${client.ws.ping}ms`}`,
                            ),
                        (text) => text.setContent(`**Uptime:** ${this.#os.uptime}`),
                        (text) =>
                            text.setContent(
                                `**Operating System:** \`${this.#os.platform} (${require('os').arch()})\``,
                            ),
                        (text) =>
                            text.setContent(
                                `**CPU:** \`${this.#os.cpu.cpu.model}\` • Cores: \`${require('os').cpus().length}\` • Usage: \`${this.#os.cpu.percent}%\``,
                            ),
                        (text) =>
                            text.setContent(
                                `**RAM:** \`${this.#os.ram.used} / ${this.#os.ram.total} MB\``,
                            ),
                    )

                    .addSeparatorComponents((separator) => separator)

                    .addTextDisplayComponents((text) =>
                        text.setContent(
                            `**Versions:** Node.js \`${process.version}\` • Discord.js \`${require('discord.js').version}\`\n` +
                                `**Repository:** [${this.#path}](${this.#git.repoURL}) ([${this.#git.commitHash}](${this.#git.repoURL.replace('.git', '')}/commit/${this.#git.commitHash}))\n`,
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
