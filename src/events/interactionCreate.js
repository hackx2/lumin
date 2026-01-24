const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
const notification = require('../utils/notification');
const settings = require('../utils/settings');

const checksDir = path.join(__dirname, '../utils/settings');
const defaultSettings = settings();

module.exports = {
    id: Events.InteractionCreate,

    async run(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        const settings = { ...defaultSettings, ...command.settings };
        const checkFiles = fs.readdirSync(checksDir).filter((f) => f.endsWith('.js'));

        for (const file of checkFiles) {
            const checkName = file.replace('.js', '');
            if (settings[checkName] !== defaultSettings[checkName]) {
                const checkModule = require(path.join(checksDir, file));
                const passed = await checkModule.run(client, interaction, settings, command);
                if (!passed) return;
            }
        }

        try {
            await command.run(interaction, client);
        } catch (err) {
            console.error(err);

            if (!interaction.replied) {
                await interaction.reply(
                    notification('An error occurred while executing the command.......', {
                        ephemeral: true,
                    }),
                );
            }
        }
    },
};
