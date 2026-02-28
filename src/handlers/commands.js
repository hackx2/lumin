'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { Collection, REST, Routes } = require('discord.js');
const { error, info, success, warn } = require('../utils/logger');

module.exports = class extends require('./~BaseHandler') {
    constructor(client) {
        super(client, '../commands');
        this.client.commands = new Collection();
        this.rest = new REST({ version: '10' }).setToken(process.lumin.bot.token);
    }

    loadCommands(dir) {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const filePath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                this.loadCommands(filePath);
                continue;
            }
            if (!entry.name.endsWith('.js') || entry.name.startsWith('~')) continue;

            try {
                delete require.cache[require.resolve(filePath)];
                const CommandClass = require(filePath);
                const command = new CommandClass();

                if (!command?.data?.name || typeof command.run !== 'function') {
                    warn(`Invalid command: ${filePath}`);
                    continue;
                }

                this.client.commands.set(command.data.name, command);
            } catch (err) {
                error(`Failed to load command: ${filePath}`, err);
            }
        }
    }

    async run() {
        this.loadCommands(this.path);

        const payload = this.client.commands
            .filter((cmd) => cmd.settings.prefixed !== 'PREFIXED')
            .map((cmd) => cmd.data.toJSON());

        try {
            info(`Refreshing`, slashPayload.length, `application (/) commands…`);
            const GET = await this.rest.put(
                Routes.applicationGuildCommands(
                    process.lumin.bot.client_id,
                    process.lumin.bot.guild_id,
                ),
                { body: payload },
            );
            success('Successfully registered', GET.length, 'application (/) commands.');
        } catch (err) {
            error('Failed to register application commands:', err);
        }
    }
};
