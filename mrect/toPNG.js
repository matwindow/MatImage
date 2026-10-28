const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'MatImage', 'mrect', '0000.mrect');
const outputFile = path.join(__dirname, 'MatImage', 'mrect', '0000_preview.png');

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
    const base64Svg = Buffer.from(svgContent).toString('base64');
    const htmlWrapper = `<html><body style="margin:0;"><img src="data:image/svg+xml;base64,${base64Svg}" width="200" height="200"/></body></html>`;
    
    const htmlFile = path.join(__dirname, 'temp_render.html');
    fs.writeFileSync(htmlFile, htmlWrapper);
    
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    
    const { execSync } = require('child_process');
    execSync(`npx npx chard-cli ${htmlFile} ${outputFile} --width 200 --height 200`, { stdio: 'ignore' });
    
    fs.unlinkSync(htmlFile);
    console.log('Success');
} catch (err) {
    process.exit(1);
}
