const fs = require('fs');
const path = require('path');

function loadEvents(client, dir) {
    const eventFolder = fs.readdirSync(dir, { withFileTypes: true });

    for (const evnt of eventFolder) {
        const fullPath = path.join(dir, evnt.name);

        if (evnt.isDirectory()) {
            loadEvents(client, fullPath);
            continue;
        }

        if (!evnt.name.endsWith('.js')) continue;

        delete require.cache[require.resolve(fullPath)];

        const event = require(fullPath);

        if (!event?.id || typeof event.run !== 'function') {
            console.warn(`Invalid event file${fullPath}`);
            continue;
        }

        async function handler(...args) {
            try {
                await event.run(...args, client);
            } catch (err) {
                console.error(`Error in event ${event.id}`, err);
            }
        }

        if (event.once) {
            client.once(event.id, handler);
        } else {
            client.on(event.id, handler);
        }
    }
}

module.exports.run = (client) => {
    const eventsPath = path.join(__dirname, '../events');
    loadEvents(client, eventsPath);
};
