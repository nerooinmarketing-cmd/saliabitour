// Script to fetch OG images from each hotel's website
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const hotelURLs = [
  { name: 'Crystal Hotels', url: 'https://www.crystalhotels.com.tr/' },
  { name: 'Özkaymak Select Resort Hotel', url: 'https://select.ozkaymakhotels.com.tr/tr' },
  { name: 'AQI Pegasos Royal (TT Hotels)', url: 'https://www.tthotels.com/tr/hotel/aqi-pegasos-royal' },
  { name: 'Daima Biz Hotel', url: 'https://daimahotels.com/' },
  { name: 'Washington Resort Hotel & SPA', url: 'https://washingtonresorthotel.com/tr/' },
  { name: 'Orange County Resort Hotel', url: 'https://www.orangecounty.com.tr/' },
  { name: 'Arcanus Hotels Sorgun', url: 'https://arcanushotelssorgun.com/' },
  { name: 'Sherwood Hotels', url: 'https://sherwoodhotels.com.tr/' },
  { name: 'Kremlin Palace (PGS Hotels)', url: 'https://kremlinpalace.com.tr/' },
  { name: 'Swandor Hotels & Resorts', url: 'https://www.swandorhotels.com/tr/' },
  { name: 'Paloma Finesse Side', url: 'https://www.palomahotels.com/' },
  { name: 'Haydarpasha Palace', url: 'https://www.haydarpashapalace.com/' },
  { name: 'Limak Hotels', url: 'https://www.limakhotels.com/' },
  { name: 'Sueno Hotels Beach Side', url: 'https://sueno.com.tr/' },
  { name: 'Spice Hotel & SPA', url: 'https://spice.com.tr/' },
  { name: 'Selectum Hotels', url: 'https://www.selectumhotels.com/tr' },
  { name: 'Regnum Carya Golf & SPA Resort', url: 'https://www.regnumhotels.com/' },
  { name: 'Baia Hotels', url: 'https://baiahotels.com/' },
  { name: 'Granada Luxury Belek', url: 'https://www.granada.com.tr/' },
  { name: 'TUI Magic Life Jacaranda', url: 'https://www.jacaranda-hotels.com/' },
  { name: 'Kirman Premium', url: 'https://www.kirmanhotels.com/' },
  { name: 'IC Hotels Santai Family Resort', url: 'https://santai.ichotels.com.tr/' },
  { name: 'Akra Hotel', url: 'https://www.akrahotels.com/tr/' },
  { name: 'Barut Hotels Collection', url: 'https://baruthotels.com/tr' },
  { name: 'Royal Alhambra Palace', url: 'https://www.royalalhambrapalace.com/' },
  { name: 'Rixos Downtown Antalya', url: 'https://www.rixos.com/tr' },
  { name: 'Ethno Hotels', url: 'https://www.ethnohotels.com/' },
  { name: 'Cullinan Hotels', url: 'https://www.cullinanhotels.com/' },
  { name: 'Adalya Hotels', url: 'https://www.adalyahotels.com/' },
  { name: 'Lujo Hotel', url: 'https://lujohotel.com/tr' },
  { name: 'Juju Premier Palace', url: 'https://www.jujupremierpalace.com/tr/' }
];

function fetchPage(url, timeout = 8000) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const timer = setTimeout(() => reject(new Error('timeout')), timeout);
    proto.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        clearTimeout(timer);
        fetchPage(res.headers.location, timeout).then(resolve).catch(reject);
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        clearTimeout(timer);
        resolve(data);
      });
    }).on('error', (e) => {
      clearTimeout(timer);
      reject(e);
    });
  });
}

function extractOGImage(html) {
  // Try og:image first
  let match = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
  if (!match) match = html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  return match ? match[1] : null;
}

async function main() {
  const results = {};
  for (const hotel of hotelURLs) {
    try {
      const html = await fetchPage(hotel.url);
      const ogImage = extractOGImage(html);
      if (ogImage) {
        results[hotel.name] = ogImage;
        console.log(`✓ ${hotel.name}: ${ogImage.substring(0, 80)}...`);
      } else {
        console.log(`✗ ${hotel.name}: No OG image found`);
        results[hotel.name] = null;
      }
    } catch (e) {
      console.log(`✗ ${hotel.name}: ${e.message}`);
      results[hotel.name] = null;
    }
  }
  
  fs.writeFileSync(
    path.join(__dirname, 'og_images.json'),
    JSON.stringify(results, null, 2)
  );
  console.log('\nSaved to og_images.json');
}

main();
