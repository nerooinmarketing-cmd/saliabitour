const fs = require('fs');
const path = require('path');

const hotelsPath = path.join(__dirname, '..', 'src', 'data', 'hotels.js');
const realImagesPath = path.join(__dirname, 'real_hotel_images.json');
const ogImagesPath = path.join(__dirname, 'og_images.json');

let content = fs.readFileSync(hotelsPath, 'utf-8');
const realImages = JSON.parse(fs.readFileSync(realImagesPath, 'utf-8'));
const ogImages = JSON.parse(fs.readFileSync(ogImagesPath, 'utf-8'));

// Hardcoded verified list from fix_all_images.cjs as additional fallback
const hardcodedVerified = {
  'Kaya Belek': 'https://kayahotels.com/wp-content/uploads/2025/08/08-kayabelek-e1755797703175.png',
  'Vikingen Infinity Resort & Spa': 'https://www.vikingenhotels.com/img/vikingen-main.jpg',
  'Doğanay Beach Club Hotel': 'https://www.doganayotel.com/images/otherphotos/media_685bcbd9e050e.jpg',
  'Washington Resort Hotel & SPA': 'https://washingtonresorthotel.com/wp-content/uploads/standart-oda-kara-manzarali-3.webp',
  'Orange County Resort Hotel': 'https://orangecounty.com.tr/myimages/onizle.jpg',
  'Spice Hotel & SPA': 'https://spice.com.tr/cms/phpThumb.php?w=800&h=600&zc=1&src=../uploads/default.jpg',
  'Swandor Hotels & Resorts': 'https://framerusercontent.com/images/HhNjtI28oQyu3ebZzbIKTAxMBc.png',
  'Barut Hotels Collection': 'https://baruthotels.com/meta/barut-hotels-default-cover.png',
  'Royal Alhambra Palace': 'https://images.ctfassets.net/clfku09f5nrd/215fk6IcJz7GTfr8CwjZYw/0d4c7d81eeaff46/royal-alhambra.jpg',
  'Lujo Hotel': 'https://lujohotel.com/opengraph-image.png'
};

const hotelPattern = /\{\s*"id":\s*"(\d+)",\s*"nameTR":\s*"([^"]+)"/g;
const hotels = [];
let m;
while ((m = hotelPattern.exec(content)) !== null) {
  hotels.push({ id: m[1], name: m[2], start: m.index });
}

let updatedContent = content;
let mainUpdates = 0;
let roomUpdates = 0;

for (let i = 0; i < hotels.length; i++) {
  const hotel = hotels[i];
  const nextStart = i + 1 < hotels.length ? hotels[i + 1].start : updatedContent.length;
  const section = updatedContent.substring(hotel.start, nextStart);
  
  const realData = realImages[hotel.name];
  const ogUrl = ogImages[hotel.name];
  const hardcodedUrl = hardcodedVerified[hotel.name];
  
  let bestMainImage = null;
  let roomGallery = [];
  
  if (realData && realData.images && realData.images.length > 0) {
    // Filter out social media icons or small images if any
    const filteredImages = realData.images.filter(img => 
      !img.includes('facebook') && 
      !img.includes('twitter') && 
      !img.includes('youtube') && 
      !img.includes('instagram') &&
      !img.includes('logo') &&
      !img.endsWith('.svg') &&
      !img.endsWith('.png') // sometimes logos are png, but real photos are usually jpg/webp
    );
    
    if (filteredImages.length > 0) {
      bestMainImage = filteredImages[0];
      roomGallery = filteredImages.slice(1);
    } else if (realData.images.length > 0) {
      bestMainImage = realData.images[0];
      roomGallery = realData.images.slice(1);
    }
  }
  
  if (!bestMainImage && ogUrl && !ogUrl.includes('logo') && !ogUrl.endsWith('.svg')) {
    bestMainImage = ogUrl;
  }
  
  if (!bestMainImage) {
    bestMainImage = hardcodedUrl;
  }
  
  if (!bestMainImage) continue;

  let fixed = section;

  // Replace main image if it's Unsplash or TripAdvisor
  const mainImagePattern = /("images":\s*\[\s*")[^"]+(")/;
  const currentMainMatch = section.match(mainImagePattern);
  if (currentMainMatch) {
    const currentUrl = currentMainMatch[0].split('"')[3];
    if (currentUrl.includes('unsplash.com') || currentUrl.includes('tripadvisor.com')) {
      fixed = fixed.replace(mainImagePattern, `$1${bestMainImage}$2`);
      mainUpdates++;
    }
  }

  // Replace room images if they are Unsplash or TripAdvisor
  const roomImagePattern = /"(image|gallery)":\s*(\[?\s*")([^"]+)"/g;
  let roomIdx = 0;
  fixed = fixed.replace(roomImagePattern, (match, p1, p2, p3) => {
    if (p3.includes('unsplash.com') || p3.includes('tripadvisor.com')) {
      roomUpdates++;
      const replacement = roomGallery.length > 0 ? roomGallery[roomIdx % roomGallery.length] : bestMainImage;
      roomIdx++;
      return `"${p1}": ${p2}${replacement}"`;
    }
    return match;
  });

  if (fixed !== section) {
    updatedContent = updatedContent.substring(0, hotel.start) + fixed + updatedContent.substring(nextStart);
    const diff = fixed.length - section.length;
    for (let j = i + 1; j < hotels.length; j++) {
      hotels[j].start += diff;
    }
  }
}

console.log(`Updated main images for ${mainUpdates} hotels`);
console.log(`Updated ${roomUpdates} room images`);

fs.writeFileSync(hotelsPath, updatedContent, 'utf-8');
console.log('hotels.js updated successfully.');
