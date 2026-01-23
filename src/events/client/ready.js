const { Events } = require("discord.js");

module.exports = {
    id: Events.ClientReady,
    once: true,
    async run(_) {
        console.log(`Lumin has awoken... 🌙🌙`);
    }
}