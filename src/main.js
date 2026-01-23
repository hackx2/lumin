require('dotenv').config();

const { Client, GatewayIntentBits, Events } = require("discord.js");
const fs = require("fs"); const path = require("path");

const client = new Client({ intents: GatewayIntentBits.Guilds });
client.owners = process.env.OWNER_IDS.split('||').map(id => id.trim());

const handlerPath = path.join(__dirname, './handlers');
for (const handler of fs.readdirSync(handlerPath, { withFileTypes: true })) {
    if (handler.isDirectory()) continue; // mrrp

    const modulePath = path.join(handlerPath, handler.name);
    const module = require(modulePath);

    if (module?.run) {
        module.run(client);
    }
}

client.login(process.env.TOKEN);