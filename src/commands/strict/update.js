const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { execSync, exec } = require('child_process');

module.exports = class extends require('../~BaseCommand') {
    constructor() {
        super({ ownerOnly: true });

        this.data = new SlashCommandBuilder()
            .setName('update')
            .setDescription('pull & push')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
    }

    async stage() {
        git = await require('../../utils/git')();
        repoPath = git.repoURL.split('/').slice(-2).join('/').replace('.git', '');
    }

    async run(interaction) {
        await interaction.reply({
            content: `Pulling from git@[${repoPath}](${git.repoURL})`,
        });
        exec('git pull');

        await interaction.editReply({
            content: `Installing dependencies`,
        });
        exec('yarn install');

        await interaction.editReply({
            content: `Restarting...`,
        });
        exec('pm2 restart "Lumin"');
    }
};
