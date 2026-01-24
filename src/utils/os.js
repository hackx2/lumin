const os = require('os');

const cpu = os.cpus()[0];

// https://stackoverflow.com/questions/78978141/nodejs-how-to-get-cpu-usage-in-percentage
function getCpuPercent() {
    const cpuUsage = process.cpuUsage();
    return ((cpuUsage.user + cpuUsage.system) / 1e6).toFixed(2);
}

function formatUptime(seconds) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor(seconds / 3600) % 24;
    const m = Math.floor(seconds / 60) % 60;
    const s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
}

function getRam() {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;
    return {
        used: (used / 1024 / 1024).toFixed(2),
        total: (total / 1024 / 1024).toFixed(2),
    };
}

module.exports = {
    platform:
        process.platform === 'darwin'
            ? process.arch === 'arm64'
                ? 'macOS (Apple Silicon)'
                : 'macOS (Intel)'
            : ({
                  win32: 'Windows',
                  linux: 'Linux',
              }[process.platform] ?? 'Unknown'),

    get uptime() {
        return formatUptime(process.uptime());
    },

    cpu: {
        cpu,
        get percent() {
            return getCpuPercent();
        },
    },

    get ram() {
        return getRam();
    },
};
