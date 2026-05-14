// Bulk fetch hotel images from their websites
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

function fetchPage(url, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const timer = setTimeout(() => reject(new Error('timeout')), timeout);
    const opts = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    };
    const req = proto.get(url, opts, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        clearTimeout(timer);
        let loc = res.headers.location;
        if (loc.startsWith('/')) {
          const u = new URL(url);
          loc = u.protocol + '//' + u.host + loc;
        }
        fetchPage(loc, timeout).then(resolve).catch(reject);
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => { clearTimeout(timer); resolve(data); });
    });
    req.on('error', (e) => { clearTimeout(timer); reject(e); });
  });
}

function extractImages(html, baseUrl) {
  const images = [];
  // img src
  const imgPattern = /(?:src|data-src|data-lazy-src|data-original)=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp|gif)(?:\?[^"']*)?)["']/gi;
  let m;
  while ((m = imgPattern.exec(html)) !== null) {
    images.push(m[1]);
  }
  // og:image
  const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                   html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  if (ogMatch) images.unshift(ogMatch[1]);
  // background-image url()
  const bgPattern = /background(?:-image)?:\s*url\(["']?(https?:\/\/[^"')]+\.(?:jpg|jpeg|png|webp))["']?\)/gi;
  while ((m = bgPattern.exec(html)) !== null) {
    images.push(m[1]);
  }
  // Filter unique, prefer large images (skip icons, logos, favicons)
  const unique = [...new Set(images)].filter(url => {
    const lower = url.toLowerCase();
    return !lower.includes('logo') && !lower.includes('favicon') && !lower.includes('icon') && 
           !lower.includes('flag') && !lower.includes('payment') && !lower.includes('sprite') &&
           !lower.includes('loading') && !lower.includes('placeholder') && !lower.includes('1x1');
  });
  return unique;
}

const hotels = [
  { name: 'Özkaymak Select Resort Hotel', url: 'https://select.ozkaymakhotels.com.tr/tr' },
  { name: 'AQI Pegasos Royal (TT Hotels)', url: 'https://www.tthotels.com/tr/hotel/aqi-pegasos-royal' },
  { name: 'Daima Biz Hotel', url: 'https://daimahotels.com/' },
  { name: 'Arcanus Hotels Sorgun', url: 'https://arcanushotelssorgun.com/' },
  { name: 'Sherwood Hotels', url: 'https://sherwoodhotels.com.tr/' },
  { name: 'Kremlin Palace (PGS Hotels)', url: 'https://www.pgshotels.com/tr' },
  { name: 'Paloma Finesse Side', url: 'https://www.palomahotels.com/tr/finesse-side' },
  { name: 'Haydarpasha Palace', url: 'https://www.haydarpashapalace.com/' },
  { name: 'Limak Hotels', url: 'https://www.limakhotels.com/tr' },
  { name: 'Sueno Hotels Beach Side', url: 'https://www.sueno.com.tr/' },
  { name: 'Selectum Hotels', url: 'https://www.selectumhotels.com/tr' },
  { name: 'Regnum Carya Golf & SPA Resort', url: 'https://www.regnumhotels.com/' },
  { name: 'Baia Hotels', url: 'https://www.baiahotels.com/tr' },
  { name: 'Granada Luxury Belek', url: 'https://www.granada.com.tr/' },
  { name: 'TUI Magic Life Jacaranda', url: 'https://www.jacaranda-hotels.com/' },
  { name: 'Kirman Premium', url: 'https://www.kirmanhotels.com/' },
  { name: 'IC Hotels Santai Family Resort', url: 'https://santai.ichotels.com.tr/' },
  { name: 'Akra Hotel', url: 'https://www.akrahotels.com/tr' },
  { name: 'Rixos Downtown Antalya', url: 'https://www.rixos.com/tr/otel/rixos-downtown-antalya' },
  { name: 'Rixos Hotels Egypt', url: 'https://www.rixos.com/tr/otel/rixos-premium-seagate' },
  { name: 'Ethno Hotels', url: 'https://www.ethnohotels.com/' },
  { name: 'Cullinan Hotels', url: 'https://www.cullinanhotels.com/' },
  { name: 'Adalya Hotels', url: 'https://www.adalyahotels.com/' },
  { name: 'Juju Premier Palace', url: 'https://www.jujupremierpalace.com/tr/' }
];

async function processHotel(hotel) {
  try {
    const html = await fetchPage(hotel.url);
    const images = extractImages(html, hotel.url);
    return { name: hotel.name, images: images.slice(0, 3), success: true };
  } catch(e) {
    return { name: hotel.name, images: [], success: false, error: e.message };
  }
}

async function main() {
  const results = {};
  // Process in batches of 6
  for (let i = 0; i < hotels.length; i += 6) {
    const batch = hotels.slice(i, i + 6);
    const promises = batch.map(h => processHotel(h));
    const batchResults = await Promise.all(promises);
    for (const r of batchResults) {
      results[r.name] = r;
      if (r.success && r.images.length > 0) {
        console.log(`✓ ${r.name}: ${r.images[0].substring(0, 80)}`);
      } else {
        console.log(`✗ ${r.name}: ${r.error || 'no images found'}`);
      }
    }
  }
  
  // Save results
  fs.writeFileSync(
    path.join(__dirname, 'real_hotel_images.json'),
    JSON.stringify(results, null, 2)
  );
  console.log('\nSaved to real_hotel_images.json');
}

main();
