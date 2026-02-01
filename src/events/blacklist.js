const { Events } = require('discord.js');

module.exports = {
    id: Events.GuildMemberAdd,
    once: false,
    async run(member) {
        const blacklist = process.env.BLACKLISTED_USER_IDS;

        if (!blacklist) return;

        const ids = blacklist.split(',');
        const mapped = ids.map((id) => id.trim());

        if (mapped.includes(member.id.toLowerCase())) {
            member.ban({ reason: 'Blacklisted...' }); // maow
        }
    },
};
