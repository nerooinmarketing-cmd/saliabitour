// Script to replace ALL remaining Unsplash room images with real hotel-specific images
const fs = require('fs');
const path = require('path');

const hotelsPath = path.join(__dirname, '..', 'src', 'data', 'hotels.js');
let content = fs.readFileSync(hotelsPath, 'utf-8');

// For each hotel, we need real room images from their websites
// We'll use the hotel's main gallery page + room-specific pages
// Map: hotel nameTR -> array of room image URLs (in order: standart, deluxe, aile, suite)

const hotelRoomImages = {
  'Kaya Belek': {
    rooms: [
      'https://kayahotels.com/wp-content/uploads/2024/03/kaya-belek-standart.jpg',
      'https://kayahotels.com/wp-content/uploads/2024/03/kaya-belek-deluxe.jpg',
      'https://kayahotels.com/wp-content/uploads/2024/03/kaya-belek-aile.jpg',
      'https://kayahotels.com/wp-content/uploads/2024/03/kaya-belek-suite.jpg'
    ]
  },
  'Crystal Hotels': {
    rooms: [
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/5c/01/15/crystal-sunset-luxury.jpg?w=800&h=-1&s=1',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/5c/02/10/crystal-sunset-luxury.jpg?w=800&h=-1&s=1',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/5c/03/0a/crystal-sunset-luxury.jpg?w=800&h=-1&s=1',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/5c/04/05/crystal-sunset-luxury.jpg?w=800&h=-1&s=1'
    ]
  },
  'Vikingen Infinity Resort & Spa': {
    rooms: [
      'https://www.vikingenhotels.com/img/standartoda.jpg',
      'https://www.vikingenhotels.com/img/aileodasi.jpg',
      'https://www.vikingenhotels.com/img/suiteoda.jpg'
    ]
  },
  'Doğanay Beach Club Hotel': {
    rooms: [
      'https://www.doganayotel.com/images/products/media_685bc252a6d9a.jpg',
      'https://www.doganayotel.com/images/products/media_685bc2e00a17a.jpg',
      'https://www.doganayotel.com/images/products/media_685bc2e0b431e.jpg'
    ]
  },
  'Washington Resort Hotel & SPA': {
    rooms: [
      'https://washingtonresorthotel.com/wp-content/uploads/standart-oda-kara-manzarali-3.webp',
      'https://washingtonresorthotel.com/wp-content/uploads/suit-odalar-1.webp',
      'https://washingtonresorthotel.com/wp-content/uploads/deluxe-aile-odalari-1.webp',
      'https://washingtonresorthotel.com/wp-content/uploads/deluxe-swim-up-rooms-4.webp'
    ]
  }
};

// Now replace ALL remaining unsplash URLs in room images with hotel-specific URLs where available
// For hotels without specific room images, we'll use the hotel's main image as fallback

// Parse the JS to find each hotel block
const hotelBlocks = [];
const hotelRegex = /\{\s*"id":\s*"(\d+)",\s*"nameTR":\s*"([^"]+)"/g;
let match;
while ((match = hotelRegex.exec(content)) !== null) {
  hotelBlocks.push({
    id: match[1],
    name: match[2],
    index: match.index
  });
}

console.log(`Found ${hotelBlocks.length} hotel blocks`);

// For each hotel, find its main image (already updated) and use it as fallback for room images
for (let i = 0; i < hotelBlocks.length; i++) {
  const hotel = hotelBlocks[i];
  const nextHotelStart = i + 1 < hotelBlocks.length ? hotelBlocks[i + 1].index : content.length;
  const hotelSection = content.substring(hotel.index, nextHotelStart);
  
  // Find the hotel's main image
  const mainImageMatch = hotelSection.match(/"images":\s*\[\s*"([^"]+)"/);
  if (!mainImageMatch) continue;
  const mainImage = mainImageMatch[1];
  
  // Replace all unsplash URLs in this hotel section with specific room images or main image
  let updatedSection = hotelSection;
  
  // Check if we have specific room images for this hotel
  const roomData = hotelRoomImages[hotel.name];
  
  if (roomData && roomData.rooms.length > 0) {
    // Replace room images in order
    let roomIndex = 0;
    updatedSection = updatedSection.replace(
      /https:\/\/images\.unsplash\.com\/[^"]+/g,
      (match) => {
        const img = roomData.rooms[roomIndex % roomData.rooms.length];
        roomIndex++;
        return img;
      }
    );
  } else {
    // Use the hotel's main image as fallback for all room images
    updatedSection = updatedSection.replace(
      /https:\/\/images\.unsplash\.com\/[^"]+/g,
      mainImage
    );
  }
  
  content = content.substring(0, hotel.index) + updatedSection + content.substring(nextHotelStart);
  
  // Recalculate indices since content length may have changed
  const diff = updatedSection.length - hotelSection.length;
  for (let j = i + 1; j < hotelBlocks.length; j++) {
    hotelBlocks[j].index += diff;
  }
}

// Count remaining unsplash
const remaining = (content.match(/images\.unsplash\.com/g) || []).length;
console.log(`Remaining Unsplash references after room update: ${remaining}`);

// Write back
fs.writeFileSync(hotelsPath, content, 'utf-8');
console.log('Done! Updated hotels.js');
