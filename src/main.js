'use strict';

require('dotenv').config();
require('./utils/config').config();

const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const fs = require('fs'); const path = require('path');
const { warn, error, success } = require('./utils/logger');

// --- Client Setup ------------------------------------------------------------

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
    presence: (() => {
        const activityMap = {
            playing: ActivityType.Playing,
            streaming: ActivityType.Streaming,
            listening: ActivityType.Listening,
            watching: ActivityType.Watching,
            competing: ActivityType.Competing,
        };

        const presence = process.lumin.presence;
        return {
            activities: [
                { name: presence.activity_name, type: activityMap[presence.activity_type] },
            ],
            status: presence.status,
        };
    })(),
});

// --- Register Owners ------------------------------------------------------------

client.owners = process.lumin.bot.owner_ids.map((id) => id.trim());
success(`Registered ${client.owners.length} owner(s) account(s)`);

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
