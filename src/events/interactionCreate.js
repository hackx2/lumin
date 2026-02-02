const { Events, MessageFlags } = require('discord.js');
const fs = require('fs');
const path = require('path');
const settings = require('../utils/settings');
const notification = require('../utils/notification');
const { error } = require('../utils/logger');

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
            error(err);

            const FOLLOW_UP_MESSAGE = 'There was an error while executing this command!';

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(
                    notification(FOLLOW_UP_MESSAGE, [MessageFlags.Ephemeral]),
                );
            } else {
                await interaction.reply(
                    notification(FOLLOW_UP_MESSAGE, [MessageFlags.Ephemeral]),
                );
            }
        }
    },
};
