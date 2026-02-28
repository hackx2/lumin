const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { execSync } = require('child_process');

module.exports = class extends require('../~BaseCommand') {
    constructor() {
        super({ ownerOnly: true, prefixed: 'PREFIXED' });

        this.data = new SlashCommandBuilder().setName('update');

        this.git = null;
        this.repoPath = 'Loading...';

        (async () => {
            try {
                this.git = await require('../../utils/git')();
                this.repoPath = this.git.repoURL.split('/').slice(-2).join('/').replace('.git', '');
            } catch (e) {}
        })();
    }
    
    namee = process.lumin.bot.name;

    async run(interaction, client, args, slash = true) {
        const reply = async (text) => {
            const payload = { content: text };
            return slash
                ? interaction.replied
                    ? interaction.editReply(payload)
                    : interaction.reply(payload)
                : interaction.reply(payload);
        };

        try {
            execSync('pm2 -v', { stdio: 'ignore' });
        } catch (e) {
            return await reply("pm2 isn't even installed.. meow?");
        }

        let isLumin = false;
        try {
            execSync(`pm2 describe "${namee}"`, { stdio: 'ignore' });
            isLumin = true;
        } catch (e) {}

        await reply(`Pulling from git@[${this.repoPath}](<${this.git?.repoURL || '...'}>)`);

        try {
            execSync('git pull');

            await reply(`Installing dependencies..`);
            execSync('yarn install');

            if (!isLumin) {
                await reply(`"${namee}" instance not found, starting it up..`);
                execSync(`pm2 start src/main.js --name "${namee}"`);
            } else {
                await reply(`Restarting....`);
                execSync(`pm2 restart "${namee}"`);
            }
        } catch (err) {
            await reply(`Failed to update: ${err.message}`);
        }
    }
};
