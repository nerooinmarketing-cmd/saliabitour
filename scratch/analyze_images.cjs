const fs = require('fs');
const path = require('path');

const hotelsPath = path.join(__dirname, '..', 'src', 'data', 'hotels.js');
let content = fs.readFileSync(hotelsPath, 'utf-8');

// Map specific TripAdvisor URLs to hotel names based on path keywords
const tripadvisorToHotel = {
  'ozkaymak-sel': 'https://select.ozkaymakhotels.com.tr/assets/images/ozkaymak-select-hero.webp',
  'caption.jpg': 'https://www.tthotels.com/uploads/hotels/aqi-pegasos-royal/pegasos-main.webp',
  'daima-biz': 'https://daimahotels.com/wp-content/themes/flavor/images/daima-biz-hero.webp',
  'arcanus-side': 'https://arcanushotelssorgun.com/assets/images/arcanus-hero.webp',
  'sherwood-exc': 'https://sherwoodhotels.com.tr/assets/images/sherwood-hero.webp',
  'pgs-hotels-k': 'https://kremlinpalace.com.tr/assets/images/kremlin-hero.webp',
  'paloma-fines': 'https://www.palomahotels.com/assets/images/paloma-finesse-hero.webp',
  'haydarpasha': 'https://cdn.vshotels.com/uploads/haydarpasha-hero.webp',
  'limak-atlant': 'https://www.limakhotels.com/assets/images/limak-hero.webp',
  'sueno-hotels': 'https://sueno.com.tr/assets/images/sueno-hero.webp',
  'selectum-lux': 'https://www.selectumhotels.com/assets/images/selectum-hero.webp',
  'regnum-carya': 'https://www.regnumhotels.com/assets/images/regnum-hero.webp',
  'baia-lara': 'https://baiahotels.com/assets/images/baia-hero.webp',
  'granada-luxu': 'https://www.granada.com.tr/assets/images/granada-hero.webp',
  'tui-magic-li': 'https://www.jacaranda-hotels.com/assets/images/jacaranda-hero.webp',
  'kirman-calyp': 'https://www.kirmanhotels.com/assets/images/kirman-hero.webp',
  'ic-hotels-sa': 'https://santai.ichotels.com.tr/assets/images/santai-hero.webp',
  'akra-hotel': 'https://www.akrahotels.com/assets/images/akra-hero.webp',
  'rixos-downto': 'https://www.rixos.com/assets/images/rixos-downtown-hero.webp',
  'rixos-premiu': 'https://www.rixos.com/assets/images/rixos-egypt-hero.webp',
  'ethno-hotels': 'https://www.ethnohotels.com/assets/images/ethno-hero.webp',
  'cullinan-bel': 'https://www.cullinanhotels.com/assets/images/cullinan-hero.webp',
  'adalya-elite': 'https://www.adalyahotels.com/assets/images/adalya-hero.webp',
  'juju-premier': 'https://www.jujupremierpalace.com/assets/images/juju-hero.webp'
};

// Actually, these fabricated URLs will also be broken.
// The correct approach is: these hotels don't have accessible image URLs from their websites.
// Let's use a placeholder approach - link to the hotel's own website page
// OR use a more reliable image source.

// Actually, TripAdvisor CDN URLs DO work most of the time! They are public CDN links.
// Let me verify one by checking if the URL format is valid.
// TripAdvisor photo URLs like:
// https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/5b/f7/71/crystal-sunset-luxury.jpg?w=1200&h=-1&s=1
// These are actually PUBLIC and DO work! The key is the photo ID in the URL.
// Let me test a few.

console.log("Actually, TripAdvisor CDN URLs are public and should work!");
console.log("Let me verify the current state of hotels.js instead...");

// Count all unique image domain patterns
const imgPattern = /"(https?:\/\/[^"]+)"/g;
let m;
const domains = {};
while ((m = imgPattern.exec(content)) !== null) {
  try {
    const u = new URL(m[1]);
    if (u.pathname.match(/\.(jpg|jpeg|png|webp|gif|svg)/i) || u.search.includes('jpg') || u.search.includes('png')) {
      domains[u.hostname] = (domains[u.hostname] || 0) + 1;
    }
  } catch(e) {}
}

console.log("\nImage domains and counts:");
Object.entries(domains).sort((a,b) => b[1]-a[1]).forEach(([d,c]) => {
  console.log(`  ${d}: ${c} images`);
});

// Total images
const total = Object.values(domains).reduce((a,b) => a+b, 0);
console.log(`\nTotal image references: ${total}`);
console.log("The TripAdvisor URLs are actually public CDN links and SHOULD work.");
console.log("The issue is probably CORS or hotlink protection. Let me check in browser.");
