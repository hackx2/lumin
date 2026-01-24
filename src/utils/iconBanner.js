const { createCanvas, loadImage } = require('@napi-rs/canvas');

const imageCache = new Map();
async function fetchImage(url) {
    if (!url) return null;
    if (imageCache.has(url)) return imageCache.get(url);
    const img = await loadImage(url);
    imageCache.set(url, img);
    return img;
}

function getRenderID(userID, avatarURL, bannerURL, version = 1) {
    // hmm.. what else could i use this for..
    const hash = require('crypto')
        .createHash('md5')
        .update(`${userID}|${avatarURL}|${bannerURL}|v${version}`)
        .digest('hex');
    return hash.slice(0, 8);
}

function roundRect(ctx, x, y, width, height, radius) { // MY BRAINNNNNN
    radius = Math.min(radius, width / 2, height / 2);
    
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
}

const renderCache = new Map();
module.exports = async function ({ userID, avatarURL, bannerURL }) {
    const renderID = getRenderID(userID, avatarURL, bannerURL);

    if (renderCache.has(renderID)) {
        return { buffer: renderCache.get(renderID), id: renderID };
    }

    const canvasWidth = 960;
    const canvasHeight = 540 / 1.5;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    const avatarImage = await fetchImage(avatarURL);
    const bannerImage = await fetchImage(bannerURL);

    ctx.fillStyle = '#1a1a1aff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    if (avatarImage || bannerImage) {
        ctx.save();
        ctx.filter = 'blur(25px)';
        ctx.globalAlpha = 0.6;
        if (avatarImage) ctx.drawImage(avatarImage, 0, 0, canvasWidth, canvasHeight);
        if (bannerImage) ctx.drawImage(bannerImage, 0, 0, canvasWidth, canvasHeight);
        ctx.restore();
    } else {
        ctx.fillStyle = '#0e0e0eff';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    const lineCount = 13, maxAmplitude = 25;
    ctx.save();
    ctx.strokeStyle = '#ffffff14';
    ctx.lineWidth = 1;
    for (let i = 0; i < lineCount; i++) { // my awful attempt at a topographic map-like background overlay :<
        ctx.beginPath();                  // I mean- it was more of something i was aiming to do..
        const yBase = i * (canvasHeight / lineCount);
        ctx.beginPath();
        for (let x = 0; x <= canvasWidth; x += 10) {
            const noise = Math.sin((x / canvasWidth) * Math.PI * 4 + i) * maxAmplitude * Math.random();
            const y = yBase + noise;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    ctx.restore();

    if (avatarImage) {
        const avatarSize = 256;
        const avatarX = 35, avatarY = (canvasHeight - avatarSize) / 2;

        ctx.save();
        roundRect(ctx, avatarX, avatarY, avatarSize, avatarSize, 40);
        ctx.fillStyle = '#2a2a2aff';
        ctx.fill();
        ctx.clip();
        ctx.drawImage(avatarImage, avatarX, avatarY, avatarSize, avatarSize);
        ctx.restore();
    }

    ctx.save();
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#ffffff4d';
    ctx.textAlign = 'right';
    ctx.fillText(renderID, canvasWidth - 10, canvasHeight - 10);
    ctx.restore();

    const buffer = canvas.toBuffer('image/png');
    renderCache.set(renderID, buffer);
    return { buffer, id: renderID };
};
