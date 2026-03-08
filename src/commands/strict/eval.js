const vm = require('vm');
const util = require('util');
const { SlashCommandBuilder } = require('discord.js');

module.exports = class extends require('../~BaseCommand') {
    constructor() {
        super({ ownerOnly: true, prefixed: 'PREFIXED' });

        this.data = new SlashCommandBuilder().setName('eval')
    }

    async run(interaction, client, args, slash = true) {
        const code = slash ? interaction.options.getString('code') : args.join(' ');
        if (!code) return !slash && interaction.reply('send some code.. meow.');

        const clean = (text) => {
            if (typeof text !== 'string') text = util.inspect(text, { depth: 1 });

            const secrets = [client.token, process.cwd()].filter(Boolean);
            let sanitized = text;

            for (const secret of secrets) {
                sanitized = sanitized.split(secret).join('[woa~.. stopp itt :c]');
            }

            // ples no dox me
            const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;
            sanitized = sanitized.replace(ipRegex, '[nuh uh. no ip for uuu >:3]');

            return sanitized;
        };

        try {
            const result = await vm.runInNewContext(code, {
                client,
                interaction,
                require,
                console,
                process,
                util,
                discord: require('discord.js'),
            });

            let output = clean(result);
            if (output.length > 1900) output = output.substring(0, 1900) + '...';

            return interaction.reply({ content: `\`\`\`js\n${output}\n\`\`\`` });
        } catch (err) {
            return interaction.reply({ content: `\`\`\`js\nError: ${clean(err.message)}\n\`\`\`` });
        }
    }
};
