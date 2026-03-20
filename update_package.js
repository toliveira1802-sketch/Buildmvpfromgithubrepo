const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
pkg.devDependencies['@tailwindcss/vite'] = '4.1.12';
fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
console.log('Updated package.json');
