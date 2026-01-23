module.exports = (overrides = {}) => ({
    ownerOnly: false,
    guildOnly: false,
    botPermissions: [],
    userPermissions: [],
    cooldown: 0,
    ...overrides,
});
