// Script to fetch OG images from Booking.com pages for the missing hotels
const https = require('https');
const fs = require('fs');
const path = require('path');

const hotelBookingPages = [
  { name: 'Crystal Hotels', url: 'https://www.booking.com/hotel/tr/crystal-sunset-luxury-resort-spa.tr.html' },
  { name: 'Özkaymak Select Resort Hotel', url: 'https://www.booking.com/hotel/tr/ozkaymak-select-resort-alanya.tr.html' },
  { name: 'AQI Pegasos Royal (TT Hotels)', url: 'https://www.booking.com/hotel/tr/aqi-pegasos-royal.tr.html' },
  { name: 'Daima Biz Hotel', url: 'https://www.booking.com/hotel/tr/daima-biz.tr.html' },
  { name: 'Arcanus Hotels Sorgun', url: 'https://www.booking.com/hotel/tr/arcanus-side-resort.tr.html' },
  { name: 'Sherwood Hotels', url: 'https://www.booking.com/hotel/tr/sherwood-exclusive-lara.tr.html' },
  { name: 'Kremlin Palace (PGS Hotels)', url: 'https://www.booking.com/hotel/tr/wow-kremlin-palace.tr.html' },
  { name: 'Swandor Hotels & Resorts', url: 'https://www.booking.com/hotel/tr/swandor-hotels-resorts-topkapi-palace.tr.html' },
  { name: 'Paloma Finesse Side', url: 'https://www.booking.com/hotel/tr/paloma-finesse-side.tr.html' },
  { name: 'Haydarpasha Palace', url: 'https://www.booking.com/hotel/tr/haydarpasha-palace.tr.html' },
  { name: 'Limak Hotels', url: 'https://www.booking.com/hotel/tr/limak-lara-de-luxe-hotel-resort.tr.html' },
  { name: 'Sueno Hotels Beach Side', url: 'https://www.booking.com/hotel/tr/sueno-hotels-beach-side.tr.html' },
  { name: 'Spice Hotel & SPA', url: 'https://www.booking.com/hotel/tr/spice-hotel-spa.tr.html' },
  { name: 'Selectum Hotels', url: 'https://www.booking.com/hotel/tr/selectum-luxury-resort.tr.html' },
  { name: 'Regnum Carya Golf & SPA Resort', url: 'https://www.booking.com/hotel/tr/regnum-carya-golf-spa-resort.tr.html' },
  { name: 'Baia Hotels', url: 'https://www.booking.com/hotel/tr/baia-lara.tr.html' },
  { name: 'Granada Luxury Belek', url: 'https://www.booking.com/hotel/tr/granada-luxury-belek.tr.html' },
  { name: 'TUI Magic Life Jacaranda', url: 'https://www.booking.com/hotel/tr/magic-life-jacaranda-imperial.tr.html' },
  { name: 'Kirman Premium', url: 'https://www.booking.com/hotel/tr/kirman-belazur-resort-spa.tr.html' },
  { name: 'IC Hotels Santai Family Resort', url: 'https://www.booking.com/hotel/tr/ic-santai.tr.html' },
  { name: 'Akra Hotel', url: 'https://www.booking.com/hotel/tr/akra-barut.tr.html' },
  { name: 'Barut Hotels Collection', url: 'https://www.booking.com/hotel/tr/barut-lara.tr.html' },
  { name: 'Royal Alhambra Palace', url: 'https://www.booking.com/hotel/tr/royal-alhambra-palace.tr.html' },
  { name: 'Rixos Downtown Antalya', url: 'https://www.booking.com/hotel/tr/rixos-downtown.tr.html' },
  { name: 'Ethno Hotels', url: 'https://www.booking.com/hotel/tr/ethno-belek.tr.html' },
  { name: 'Cullinan Hotels', url: 'https://www.booking.com/hotel/tr/cullinan-belek.tr.html' },
  { name: 'Adalya Hotels', url: 'https://www.booking.com/hotel/tr/adalya-elite-lara-hotel.tr.html' },
  { name: 'Lujo Hotel', url: 'https://www.booking.com/hotel/tr/lujo-bodrum.tr.html' },
  { name: 'Juju Premier Palace', url: 'https://www.booking.com/hotel/tr/amara-premier-palace.tr.html' }
];

async function fetchOGImage(url) {
  return new Promise((resolve) => {
    const opts = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };
    https.get(url, opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const match = data.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
        resolve(match ? match[1] : null);
      });
    }).on('error', () => resolve(null));
  });
}

async function main() {
  const results = {};
  for (const hotel of hotelBookingPages) {
    const img = await fetchOGImage(hotel.url);
    if (img) {
      results[hotel.name] = img;
      console.log(`✓ ${hotel.name}: ${img}`);
    } else {
      console.log(`✗ ${hotel.name}`);
    }
    // Small delay to avoid being blocked
    await new Promise(r => setTimeout(r, 500));
  }
  fs.writeFileSync(path.join(__dirname, 'booking_og_images.json'), JSON.stringify(results, null, 2));
}

main();
