const fs = require('fs'); const path = require('path'); const toml = require('smol-toml');

module.exports = {
    config: () => {
        const file = fs.readFileSync(path.join(__dirname, '../../config.toml'), 'utf8');
        const config = toml.parse(file);
        process.lumin = config; 
    },
};