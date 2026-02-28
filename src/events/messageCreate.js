const { Events } = require('discord.js');

module.exports = {
    id: Events.MessageCreate,
    once: false,
    async run(message, client) {
        console.log(message.content);
        const prefix = process.lumin.bot.prefix || '!';
        
        if (message.author.bot || !message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        console.log(commandName);
        const command = client.commands.get(commandName);

        if (!command) return;

        const type = command.settings.prefixed;
        const canRun = (type === 'PREFIXED' || type === 'SLASHANDPREFIXED');

        if (canRun) {
            try {
                await command.run(message, client, args, false);
            } catch (err) {
                console.error(`Prefix execution error: ${commandName}`, err);
            }
        }
    },
};
