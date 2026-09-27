const fs = require('fs');
const html = fs.readFileSync('dashboard.html', 'utf8');

let depth = 0;
let lines = html.split('\n');
for (let i=0; i<lines.length; i++) {
    let line = lines[i];
    if (line.includes('<div')) depth++;
    if (line.includes('</div')) depth--;
    if (line.includes('<footer') || line.includes('</footer')) {
        console.log(`Line ${i}: ${line.trim()} (Div Depth: ${depth})`);
    }
}
