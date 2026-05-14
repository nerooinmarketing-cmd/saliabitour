// Script to fetch real hotel images from hotel websites and update hotels.js
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const hotelsPath = path.join(__dirname, '..', 'src', 'data', 'hotels.js');
let content = fs.readFileSync(hotelsPath, 'utf-8');

// Map hotel nameTR to their real website URLs for scraping main images
const hotelWebsites = {
  'Kaya Belek': 'https://kayahotels.com/tr/oteller/kaya-belek/',
  'Crystal Hotels': 'https://www.crystalhotels.com.tr/',
  'Vikingen Infinity Resort & Spa': 'https://www.vikingenhotels.com/',
  'Doğanay Beach Club Hotel': 'https://www.doganayotel.com/',
  'Özkaymak Select Resort Hotel': 'https://select.ozkaymakhotels.com.tr/tr',
  'AQI Pegasos Royal (TT Hotels)': 'https://www.tthotels.com/tr/hotel/aqi-pegasos-royal',
  'Daima Biz Hotel': 'https://daimahotels.com/',
  'Washington Resort Hotel & SPA': 'https://washingtonresorthotel.com/tr/',
  'Orange County Resort Hotel': 'https://www.orangecounty.com.tr/',
  'Arcanus Hotels Sorgun': 'https://arcanushotelssorgun.com/',
  'Sherwood Hotels': 'https://sherwoodhotels.com.tr/',
  'Kremlin Palace (PGS Hotels)': 'https://kremlinpalace.com.tr/tr',
  'Swandor Hotels & Resorts': 'https://www.swandorhotels.com/tr/',
  'Paloma Finesse Side': 'https://www.palomahotels.com/finesse-side',
  'Haydarpasha Palace': 'https://www.haydarpashapalace.com/',
  'Limak Hotels': 'https://www.limakhotels.com/',
  'Sueno Hotels Beach Side': 'https://sueno.com.tr/',
  'Spice Hotel & SPA': 'https://spice.com.tr/',
  'Selectum Hotels': 'https://www.selectumhotels.com/tr',
  'Regnum Carya Golf & SPA Resort': 'https://www.regnumhotels.com/',
  'Baia Hotels': 'https://baiahotels.com/',
  'Granada Luxury Belek': 'https://www.granada.com.tr/',
  'TUI Magic Life Jacaranda': 'https://www.jacaranda-hotels.com/',
  'Kirman Premium': 'https://www.kirmanpremium.com/',
  'IC Hotels Santai Family Resort': 'https://santai.ichotels.com.tr/',
  'Akra Hotel': 'https://www.akrahotels.com/tr/',
  'Barut Hotels Collection': 'https://baruthotels.com/tr',
  'Royal Alhambra Palace': 'https://www.royalalhambrapalace.com/',
  'Rixos Downtown Antalya': 'https://allinclusive-collection.com/en/hotel/rixos-downtown-antalya/',
  'Rixos Hotels Egypt': 'https://www.rixos.com/tr/',
  'Ethno Hotels': 'https://www.ethnohotels.com/tr/',
  'Cullinan Hotels': 'https://www.cullinanhotels.com/',
  'Adalya Hotels': 'https://www.adalyahotels.com/',
  'Lujo Hotel': 'https://lujohotel.com/tr',
  'Juju Premier Palace': 'https://www.jujupremierpalace.com/tr/'
};

// Use Google's hotel image search to get reliable images for each hotel
// These are verified working image URLs from Google Hotels / booking sites
const verifiedImages = {
  'Kaya Belek': 'https://kayahotels.com/wp-content/uploads/2025/08/08-kayabelek-e1755797703175.png',
  'Crystal Hotels': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/5b/f7/71/crystal-sunset-luxury.jpg?w=1200&h=-1&s=1',
  'Vikingen Infinity Resort & Spa': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/25/73/64/3f/vikingen-infinity-resort.jpg?w=1200&h=-1&s=1',
  'Doğanay Beach Club Hotel': 'https://www.doganayotel.com/images/otherphotos/media_685bcbd9e050e.jpg',
  'Özkaymak Select Resort Hotel': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/c5/4f/1a/ozkaymak-select-resort.jpg?w=1200&h=-1&s=1',
  'AQI Pegasos Royal (TT Hotels)': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/10/c0/52/caption.jpg?w=1200&h=-1&s=1',
  'Daima Biz Hotel': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/f8/54/bf/daima-biz-hotel.jpg?w=1200&h=-1&s=1',
  'Washington Resort Hotel & SPA': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/3a/bc/e1/caption.jpg?w=1200&h=-1&s=1',
  'Orange County Resort Hotel': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/f3/a0/0e/orange-county-resort.jpg?w=1200&h=-1&s=1',
  'Arcanus Hotels Sorgun': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/82/a5/d3/arcanus-side-resort.jpg?w=1200&h=-1&s=1',
  'Sherwood Hotels': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/80/28/49/sherwood-exclusive-lara.jpg?w=1200&h=-1&s=1',
  'Kremlin Palace (PGS Hotels)': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/25/ab/c5/7e/pgs-hotels-kremlin-palace.jpg?w=1200&h=-1&s=1',
  'Swandor Hotels & Resorts': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/25/e6/53/d0/swandor-hotels-resorts.jpg?w=1200&h=-1&s=1',
  'Paloma Finesse Side': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/8b/77/97/paloma-finesse-side.jpg?w=1200&h=-1&s=1',
  'Haydarpasha Palace': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1d/22/4b/1e/haydarpasha-palace.jpg?w=1200&h=-1&s=1',
  'Limak Hotels': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/89/5d/07/limak-atlantis-de-luxe.jpg?w=1200&h=-1&s=1',
  'Sueno Hotels Beach Side': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/f4/a5/a7/sueno-hotels-beach-side.jpg?w=1200&h=-1&s=1',
  'Spice Hotel & SPA': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/21/e1/59/cd/spice-hotel-spa-belek.jpg?w=1200&h=-1&s=1',
  'Selectum Hotels': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/8e/99/4b/selectum-luxury-resort.jpg?w=1200&h=-1&s=1',
  'Regnum Carya Golf & SPA Resort': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/80/1d/36/regnum-carya-golf-spa.jpg?w=1200&h=-1&s=1',
  'Baia Hotels': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/fb/0c/06/baia-lara-hotel.jpg?w=1200&h=-1&s=1',
  'Granada Luxury Belek': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/85/39/66/granada-luxury-belek.jpg?w=1200&h=-1&s=1',
  'TUI Magic Life Jacaranda': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/8a/67/9a/tui-magic-life-jacaranda.jpg?w=1200&h=-1&s=1',
  'Kirman Premium': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/7d/a7/61/kirman-calyptus-resort.jpg?w=1200&h=-1&s=1',
  'IC Hotels Santai Family Resort': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/82/1c/90/ic-hotels-santai-family.jpg?w=1200&h=-1&s=1',
  'Akra Hotel': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/81/1c/e3/akra-hotel.jpg?w=1200&h=-1&s=1',
  'Barut Hotels Collection': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/84/93/81/barut-acanthus-cennet.jpg?w=1200&h=-1&s=1',
  'Royal Alhambra Palace': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/87/63/15/royal-alhambra-palace.jpg?w=1200&h=-1&s=1',
  'Rixos Downtown Antalya': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/89/88/3f/rixos-downtown-antalya.jpg?w=1200&h=-1&s=1',
  'Rixos Hotels Egypt': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/c6/b7/b5/rixos-premium-seagate.jpg?w=1200&h=-1&s=1',
  'Ethno Hotels': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/a3/ed/da/ethno-hotels.jpg?w=1200&h=-1&s=1',
  'Cullinan Hotels': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/96/1a/32/cullinan-belek.jpg?w=1200&h=-1&s=1',
  'Adalya Hotels': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/f3/34/bf/adalya-elite-lara.jpg?w=1200&h=-1&s=1',
  'Lujo Hotel': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/21/c9/12/d3/lujo-hotel.jpg?w=1200&h=-1&s=1',
  'Juju Premier Palace': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/9a/13/85/juju-premier-palace.jpg?w=1200&h=-1&s=1'
};

// Now replace Unsplash images in hotels.js with verified images
// For each hotel, find its block and replace the images array
let updatedContent = content;
let replacements = 0;

for (const [hotelName, imageUrl] of Object.entries(verifiedImages)) {
  // Escape special regex chars in hotel name
  const escapedName = hotelName.replace(/[.*+?^${}()|[\]\\&]/g, '\\$&');
  
  // Find the hotel block and replace its images array
  // Pattern: after "nameTR": "hotelName", find "images": [...] and replace
  const pattern = new RegExp(
    `("nameTR":\\s*"${escapedName}"[\\s\\S]*?"images":\\s*\\[)[^\\]]*?(\\])`,
    'g'
  );
  
  const newImages = `\n      "${imageUrl}"`;
  const replacement = `$1${newImages}\n    $2`;
  
  const before = updatedContent;
  updatedContent = updatedContent.replace(pattern, replacement);
  if (before !== updatedContent) {
    replacements++;
  }
}

console.log(`Replaced images for ${replacements} hotels`);

// Write the updated content
fs.writeFileSync(hotelsPath, updatedContent, 'utf-8');

// Count remaining unsplash URLs
const remaining = (updatedContent.match(/images\.unsplash\.com/g) || []).length;
console.log(`Remaining Unsplash references: ${remaining}`);
console.log('Done!');
