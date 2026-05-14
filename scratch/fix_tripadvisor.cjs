// Simple brute-force: replace ALL TripAdvisor CDN URLs with hotel-specific images
const fs = require('fs');
const path = require('path');

const hotelsPath = path.join(__dirname, '..', 'src', 'data', 'hotels.js');
let content = fs.readFileSync(hotelsPath, 'utf-8');

// Count before
const before = (content.match(/dynamic-media-cdn\.tripadvisor\.com/g) || []).length;
console.log(`TripAdvisor URLs before: ${before}`);

// Strategy: For each hotel block, find its first working image and use it for all broken ones
// Split content into hotel blocks by "id": pattern
const blocks = content.split(/(?=\{\s*"id":\s*")/);

const rebuilt = [];
for (const block of blocks) {
  if (!block.includes('"nameTR"')) {
    rebuilt.push(block);
    continue;
  }
  
  const nameMatch = block.match(/"nameTR":\s*"([^"]+)"/);
  const name = nameMatch ? nameMatch[1] : 'unknown';
  
  // Find the first non-TripAdvisor image URL in this block
  const allImgUrls = [];
  const imgPattern = /"(https?:\/\/[^"]+)"/g;
  let m;
  while ((m = imgPattern.exec(block)) !== null) {
    const url = m[1];
    if (url.includes('.jpg') || url.includes('.png') || url.includes('.webp') || url.includes('.jpeg') || url.includes('.gif') || url.includes('.svg')) {
      if (!url.includes('tripadvisor.com') && !url.includes('unsplash.com')) {
        allImgUrls.push(url);
      }
    }
  }
  
  const fallbackImg = allImgUrls.length > 0 ? allImgUrls[0] : null;
  
  if (fallbackImg) {
    // Replace all TripAdvisor URLs in this block
    const fixed = block.replace(/https:\/\/dynamic-media-cdn\.tripadvisor\.com\/[^"]+/g, fallbackImg);
    const count = (block.match(/dynamic-media-cdn\.tripadvisor\.com/g) || []).length;
    if (count > 0) {
      console.log(`${name}: replaced ${count} TripAdvisor URLs with ${fallbackImg.substring(0, 60)}...`);
    }
    rebuilt.push(fixed);
  } else {
    rebuilt.push(block);
  }
}

const result = rebuilt.join('');

const after = (result.match(/dynamic-media-cdn\.tripadvisor\.com/g) || []).length;
console.log(`\nTripAdvisor URLs after: ${after}`);
const unsplash = (result.match(/images\.unsplash\.com/g) || []).length;
console.log(`Unsplash URLs after: ${unsplash}`);

fs.writeFileSync(hotelsPath, result, 'utf-8');
console.log('Done!');
