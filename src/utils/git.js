const { execSync } = require('child_process');

module.exports = async function () {
    try {
        const repoURL = execSync('git config --get remote.origin.url', { encoding: 'utf-8' }).trim();
        const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
        return { repoURL, commitHash };
    } catch (err) {
        return { repoURL: null, commitHash: null };
    }
};
