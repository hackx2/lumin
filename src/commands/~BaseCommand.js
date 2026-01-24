class BaseCommand {
    constructor(settings) {
        this.settings = require("../utils/settings")(settings);
    }

    async run(interaction, client) {
        throw new Error('Run method not implemented in command.');
    }
}

module.exports = BaseCommand;