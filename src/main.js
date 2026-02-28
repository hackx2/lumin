'use strict';

require('./utils/config').config();

const { GatewayIntentBits } = require('discord.js');

new (require('./LuminClient'))([
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
]).start(process.lumin.bot.token);
