'use strict';

const { Client, GatewayIntentBits, ActivityType, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { error, success } = require('./utils/logger');

module.exports = class LuminClient extends Client {
    constructor() {
        super({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
            presence: LuminClient.generatePresence(),
        });

        this.owners = process.lumin.bot.owner_ids.map((id) => id.trim());
        this.commands = new Collection();

        success(`Registered ${this.owners.length} owner(s)`);
    }

    static generatePresence() {
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
    }

    loadHandlers() {
        const handlersDir = path.resolve(__dirname, 'handlers');
        let loaded = 0;

        fs.readdirSync(handlersDir, { withFileTypes: true }).forEach((entry) => {
            if (!entry.isFile() || !entry.name.endsWith('.js') || entry.name.startsWith('~'))
                return;

            const filePath = path.join(handlersDir, entry.name);
            try {
                const handler = new (require(filePath))(this);
                if (handler.run) {
                    handler.run();
                    loaded++;
                }
            } catch (err) {
                error(`Failed handler "${entry.name}": ${err.message}`);
            }
        });
        success(`Initiated ${loaded} handlers...`);
    }

    async start(token) {
        this.loadHandlers();
        return this.login(token);
    }
};
