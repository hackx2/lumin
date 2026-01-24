const fs = require('fs');
const path = require('path');
const { Collection, REST, Routes } = require('discord.js');

function loadCommands(client, dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            loadCommands(client, fullPath);
            continue;
        }

        if (!entry.name.endsWith('.js')) continue;

        delete require.cache[require.resolve(fullPath)];

        const command = require(fullPath);

        if (!command?.data || !command.data.name || typeof command.run !== 'function') {
            console.warn(`Invalid command file: ${fullPath}`);
            continue;
        }
        client.commands.set(command.data.name, command);
    }
}

module.exports.run = (client) => {
    client.commands = new Collection();

    const commandsPath = path.join(__dirname, '../commands');

    if (!fs.existsSync(commandsPath)) {
        console.warn('cmds dir not found');
        return;
    }

    loadCommands(client, commandsPath);

    const rest = new REST().setToken(process.env.TOKEN);
    const commands = client.commands.map((c) => c.data.toJSON());

    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);
            const data = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
                body: commands,
            });

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })();
};
