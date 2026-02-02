'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { warn, error } = require('../utils/logger');

module.exports = class EventHandler extends require('./~BaseHandler') {
    constructor(client) {
        super(client, '../events');
    }

    loadEvents(dir) {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const filePath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                this.loadEvents(filePath);
                continue;
            }

            if (!entry.name.endsWith('.js') || entry.name.startsWith('~')) {
                continue;
            }

            try {
                delete require.cache[require.resolve(filePath)];

                const event = require(filePath);

                if (!event?.id || typeof event.run !== 'function') {
                    warn(`Invalid event definition: ${filePath}`);
                    continue;
                }

                const handler = async (...args) => {
                    try {
                        await event.run(...args, this.client);
                    } catch (err) {
                        error(`Error in event "${event.id}"`, err);
                    }
                };

                event.once
                    ? this.client.once(event.id, handler)
                    : this.client.on(event.id, handler);
            } catch (err) {
                error(`Failed to load event: ${filePath}`, err);
            }
        }
    }

    run() {
        this.loadEvents(this.path);
    }
};
