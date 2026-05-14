const fs = require('fs');
const html = fs.readFileSync('ozkaymak_rooms.html', 'utf8');
const regex = /https:\/\/[^"'>]+\.(?:jpg|png|webp|jpeg)/gi;
const matches = html.match(regex);
const uniqueLinks = [...new Set(matches)];
console.log(JSON.stringify(uniqueLinks, null, 2));
