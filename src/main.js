'use strict';

require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs'); const path = require('path');
const { warn, error, success } = require('./utils/logger');

// --- Client Setup ------------------------------------------------------------

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
client.owners = process.env.OWNER_IDS.split(',').map((id) => id.trim());

// --- Handler Loader ----------------------------------------------------------

const handlersDirectory = path.resolve(__dirname, 'handlers');
let loadedHandlers = 0;

for (const entry of fs.readdirSync(handlersDirectory, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.js') || entry.name.startsWith('~')) {
        continue;
    }

    const filePath = path.join(handlersDirectory, entry.name);
    try {
        delete require.cache[require.resolve(filePath)];

        const HandlerClass = require(filePath);

        if (typeof HandlerClass !== 'function') {
            warn(`Handler is not a class: ${entry.name}`);
            continue;
        }

        const handler = new HandlerClass(client);

        if (typeof handler.run === 'function') {
            handler.run();
            loadedHandlers++;
            //success(`Successfully ran handler "${entry.name}"`);
        } else {
            warn(`Handler "${entry.name}" missing run method`);
        }
    } catch (err) {
        error(`Failed to initialize handler "${entry.name}"`);
        error(err);
    }
}

success(`Successfully initiated ${loadedHandlers} handlers...`);

// --- Login -------------------------------------------------------------------

client.login(process.env.TOKEN);
