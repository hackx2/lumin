const chalk = require('chalk').default || require('chalk');

function timestamp() {
    return new Date().toLocaleTimeString();
}

function center(text, width) {
    if (text.length >= width) return text.slice(0, width);

    const left = Math.floor((width - text.length) / 2);
    const right = width - text.length - left;

    return ' '.repeat(left) + text + ' '.repeat(right);
}

function format(label, colorFn, msg) {
    if (typeof colorFn !== 'function') {
        colorFn = (t) => t;
    }

    const time = timestamp();
    const level = center(label, 11);

    console.log(colorFn(`{ ☕ } : [  ${time}  | ${level} ]: ${msg}`));
}

function formatRest(rest) {
    return rest.map(String).join(' ');
}

module.exports = {
    info(...msg) {
        format('INFO', chalk.rgb(254, 228, 153), formatRest(msg));
    },
    success(...msg) {
        format('SUCCESS', chalk.rgb(255, 164, 112), formatRest(msg));
    },
    warn(...msg) {
        format('WARNING', chalk.rgb(255, 152, 93), formatRest(msg));
    },
    error(...msg) {
        format('EXCEPTION', chalk.rgb(255, 122, 122), formatRest(msg));
    },
};
