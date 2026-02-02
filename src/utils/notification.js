const { ContainerBuilder, MessageFlags } = require('discord.js');

module.exports = (msg, flags, props = {}) => {
    return {
        components: [new ContainerBuilder().addTextDisplayComponents((txt) => txt.setContent(msg))],
        flags: MessageFlags.IsComponentsV2 | flags,
        ...props,
    };
};
