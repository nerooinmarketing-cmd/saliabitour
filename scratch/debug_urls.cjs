const fs = require('fs');
const c = fs.readFileSync('src/data/hotels.js', 'utf-8');

// Sample TripAdvisor URL
const m = c.match(/dynamic-media-cdn\.tripadvisor\.com[^"]{0,100}/);
console.log('Sample TripAdvisor URL:', m ? m[0] : 'none');

// Find ALL unique image URLs and check patterns
const urls = new Set();
const imgRegex = /"(https?:\/\/[^"]+)"/g;
let match;
while ((match = imgRegex.exec(c)) !== null) {
  const url = match[1];
  if (url.includes('tripadvisor') || url.includes('unsplash')) {
    urls.add(url.substring(0, 80));
  }
}
console.log(`\nUnique broken URLs (${urls.size}):`);
urls.forEach(u => console.log('  ' + u));
