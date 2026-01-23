const { Events } = require("discord.js");
const fs = require("fs");
const path = require("path");
const notification = require("../utils/notification");
const settings = require("../utils/settings");

const checksDir = path.join(__dirname, "../utils/settings");

const defaultSettings = settings();

module.exports = {
    id: Events.InteractionCreate,
    async run(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        const settings = { ...defaultSettings, ...command.settings };

        const checkFiles = fs.readdirSync(checksDir).filter((f) => f.endsWith(".js"));

        for (const f of checkFiles) {
            const checkName = f.replace(".js", "");

            // mraow
            if (settings[checkName] !== defaultSettings[checkName]) {
                const module = require(path.join(checksDir, f));
                const passed = await module.run(client, interaction, settings, command);
                if (!passed) return;
            }
        }

        try {
            await command.run(interaction, client);
        } catch (err) {
            console.error(err);
            if (!interaction.replied) {
                await interaction.reply(notification("An error occurred while executing the command.......", {ephemeral: true}));
            }
        }
    },
};
