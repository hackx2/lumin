class BaseCommand {
    constructor(settings) {
        this.settings = require("../utils/settings")(settings);
    }
}

module.exports = BaseCommand;