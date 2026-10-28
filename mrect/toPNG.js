const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '0000.mrect');
const outputFile = path.join(__dirname, '0000_preview.png');

try {
    const data = fs.readFileSync(inputFile, 'utf8');
    const commands = data.split(/[;,]+/);
    
    let svgRects = '';
    let color = '000000';
    let xa = 0, xb = 0, ya = 0, yb = 0;

    commands.forEach(cmd => {
        const clean = cmd.trim();
        if (!clean) return;

        if (clean.startsWith('c*')) color = clean.substring(2);
        if (clean.startsWith('xa*')) xa = parseInt(clean.substring(3));
        if (clean.startsWith('xb*')) xb = parseInt(clean.substring(3));
        if (clean.startsWith('ya*')) ya = parseInt(clean.substring(3));
        if (clean.startsWith('yb*')) yb = parseInt(clean.substring(3));

        if (cmd.includes('yb*')) {
            const x = Math.min(xa, xb) + 100;
            const y = Math.min(ya, yb) + 100;
            const w = Math.abs(xb - xa);
            const h = Math.abs(yb - ya);
            svgRects += `  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#${color}" />\n`;
        }
    });

    const svgContent = `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://w3.org">\n${svgRects}</svg>`;
    
    fs.writeFileSync(outputFile, svgContent);
    console.log('Success');
} catch (err) {
    process.exit(1);
}
