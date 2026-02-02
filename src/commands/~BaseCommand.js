class BaseCommand {
    constructor(settings, data = undefined) {
        this.settings = require('../utils/settings')(settings);
        this.data = data;
    }

    /**
     * Return a notification component..
     *
     * @param {*} msg Data
     * @param {*} props Extra options (e.g. flags..)
     * @returns
     */
    notification(msg, props = {}) {
        return require('../utils/notification')(msg, props);
    }

    async run(interaction, client) {
        throw new Error('Not implemented');
    }
}

module.exports = BaseCommand;
