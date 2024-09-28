const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname, 'build', 'cache');
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log('Created build/cache directory.');
} else {
    console.log('Directory already exists.');
}
