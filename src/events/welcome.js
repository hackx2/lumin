const { Events } = require('discord.js');
const notification = require('../utils/notification');

module.exports = {
    id: Events.GuildMemberAdd,
    once: false,
    async run(member) {
        const channel = member.guild.channels.cache.get(process.env.WELCOME_CHANNEL);
        if (!channel) return;
        channel.send(
            notification(
                `Welcome <@${member.id}> to the Cafe!!! ☕\nMake sure to read the rules 💛`,
            ),
        );
    },
};
