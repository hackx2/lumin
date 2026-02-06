const { Events } = require('discord.js');
const { info } = require('../../utils/logger');

module.exports = {
    id: Events.ClientReady,
    once: true,
    async run(client) {
        info(`Lumin has awoken... 🌙🌙`);
    },
};
