class BaseCommand {
    constructor(settings, data = undefined) {
        this.settings = require('../utils/settings')(settings);
        this.data = data;
    }

    async stage(){}

    /**
     * Return a notification component..
     *
     * @param {*} msg Data
     * @param {*} props Extra options (e.g. flags..)
     * @returns
     */
    async notification(msg, props = {}) {
        return require('../utils/notification')(msg, props);
    }

    async run(interaction, client) {
        throw new Error('Run method not implemented in command.');
    }
}

module.exports = BaseCommand;
