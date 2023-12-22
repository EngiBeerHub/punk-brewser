fs = require('fs');
path = require('path');
srcPath = path.join(__dirname, './www/3rdpartylicenses.txt');
destPath = path.join(__dirname, './src/assets/3rdpartylicenses.txt');
fs.copyFileSync(srcPath, destPath);
console.log('3rdpartylicenses.txt has been copied to assets folder.');
