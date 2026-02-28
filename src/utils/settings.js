module.exports = (overrides = {}) => ({
    ownerOnly: false,
    guildOnly: false,
    botPermissions: [],
    userPermissions: [],
    cooldown: 0,
    permissions: [],
    prefixed: 'SLASH', // SLASH, PREFIXED, or SLASH_PREFIXED
    ...overrides,
});