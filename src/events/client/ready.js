const { Events, ActivityType, PresenceUpdateStatus } = require('discord.js');
const { info } = require('../../utils/logger');

module.exports = {
    id: Events.ClientReady,
    once: true,
    async run(client) {
        info(`Lumin has awoken... 🌙🌙`);

        client.user.setPresence({
            activities: [{ name: 'LoFi 🌙', type: ActivityType.Listening }],
            status: PresenceUpdateStatus.Idle,
        });
    },
};
