const { Events, ActivityType, PresenceUpdateStatus } = require("discord.js");

module.exports = {
    id: Events.ClientReady,
    once: true,
    async run(client) {
        console.log(`Lumin has awoken... 🌙🌙`);

        client.user.setPresence({
            activities: [{ name: 'LoFi 🌙', type: ActivityType.Listening }],
            status: PresenceUpdateStatus.Idle
        });
    }
}
