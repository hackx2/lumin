'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { error } = require('../utils/logger');

module.exports = class {
    #path;

    get path() {
        return this.#path;
    }

    set path(relativePath) {
        const resolved = path.resolve(__dirname, relativePath);

        if (!fs.existsSync(resolved)) {
            throw error('{BaseHandler}: Commands directory not found');
        }

        this.#path = resolved;
    }

    constructor(client, commandsPath) {
        if (!client) {
            throw error('{BaseHandler}: Client is required');
        }

        this.client = client;
        this.path = commandsPath;
    }

    run() {
        throw 'Not implemented';
    }
};
