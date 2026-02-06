const { Events } = require('discord.js');

module.exports = {
    id: Events.GuildMemberAdd,
    once: false,
    async run(member) {
        const blacklist = process.lumin.security.blacklisted_user_ids;

        if (!blacklist) return;

        const bList = blacklist.map((id) => id.trim());

        if (bList.includes(member.id.toLowerCase())) {
            member.ban({ reason: 'Blacklisted...' }); // maow
        }
    },
};
