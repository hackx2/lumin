const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { execSync, exec } = require('child_process');

module.exports = class extends require('../~BaseCommand') {
    constructor() {
        super({ ownerOnly: true });

        this.data = new SlashCommandBuilder()
            .setName('update')
            .setDescription('pull & push')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

        this.git = null;
        this.repoPath = null;
    }

    async stage() {
        this.git = await require('../../utils/git')();
        this.repoPath = this.git.repoURL.split('/').slice(-2).join('/').replace('.git', '');
    }

    async run(interaction) {
        await interaction.reply({
            content: `Pulling from git@[${this.repoPath}](<${this.git.repoURL}>)`,
        });
        execSync('git pull');

        await interaction.editReply({
            content: `Installing dependencies`,
        });
        execSync('yarn install');

        await interaction.editReply({
            content: `Restarting...`,
        });
        try {
            execSync('pm2 restart "Lumin"');
        } catch (e) {}
        await interaction.editReply({
            content: `done...\ndeleting in 3 seconds...`,
        });

        setTimeout(async () => {
            await interaction.deleteReply();
        }, 3000);
    }
};
