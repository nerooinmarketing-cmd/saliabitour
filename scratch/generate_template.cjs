const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const templateData = [
  {
    'Otel Adı (TR)': 'Titanic Deluxe Lara',
    'Otel Adı (EN)': 'Titanic Deluxe Lara',
    'Konum': 'Antalya / Lara',
    'Yıldız': 5,
    'Konsept': 'Ultra Her Şey Dahil',
    'Açıklama TR': 'Lara sahilinde yer alan eşsiz bir tesis...',
    'Açıklama EN': 'Unique resort located in Lara coast...',
    'Slug': 'titanic-deluxe-lara',
    'One Cikan (E/H)': 'E',
    'Durum': 'Aktif',
    'Olanaklar': 'wifi, pool, spa, restaurant, fitness, kidsclub',
    'Gorseller': 'https://images.etstur.com/files/images/hotelImages/TR/51111/m/Titanic-Deluxe-Lara-Genel-1.jpg',
    'ODA 1 Ad': 'Standart Oda',
    'ODA 1 Fiyat': 4500,
    'ODA 1 Detay': '32m2, Cift Kisilik, Kara',
    'ODA 1 Ozellik': 'Klima, TV, Minibar, Kasa, Balkon',
    'ODA 2 Ad': 'Deluxe Deniz Manzarali',
    'ODA 2 Fiyat': 6200,
    'ODA 2 Detay': '40m2, King Bed, Deniz',
    'ODA 2 Ozellik': 'Jakuzi, Klima, Genis Balkon, TV',
    'ODA 3 Ad': 'Aile Odasi',
    'ODA 3 Fiyat': 8500,
    'ODA 3 Detay': '55m2, 2 Oda, Bahce',
    'ODA 3 Ozellik': '2 Klima, 2 TV, Minibar, Bebek Yatagi'
  }
];

const ws = XLSX.utils.json_to_sheet(templateData);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Sablon");

const wscols = Object.keys(templateData[0]).map(() => ({ wch: 30 }));
ws['!cols'] = wscols;

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const filePath = path.join(publicDir, 'ByTour_Otel_Yukleme_Sablonu.xlsx');
XLSX.writeFile(wb, filePath);

console.log('Sablon olusturuldu:', filePath);
