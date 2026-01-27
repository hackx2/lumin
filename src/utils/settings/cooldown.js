const notification = require("../notification");

const cooldowns = new Map();

module.exports = {
    run: async (client, interaction, settings, command) => {
        const owners = client.owners ?? [];
        if (owners.includes(interaction.user.id) || !settings.cooldown) return true;

        // grr
        const now = Date.now();
        const key = `${interaction.user.id}:${command.data.name}`;
        const expires = cooldowns.get(key) ?? 0;

        if (now < expires) {
            const seconds = Math.ceil((expires - now) / 1000);
            await interaction.reply(
                notification(`🫸Wait \`${seconds}s\` before using this command again...`, {
                    ephemeral: true,
                }),
            );
            return false;
        }

        cooldowns.set(key, now + settings.cooldown * 1000);
        return true;
    },
};
