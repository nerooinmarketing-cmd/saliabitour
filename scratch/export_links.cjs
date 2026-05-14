const xlsx = require('xlsx');
const fs = require('fs');

const workbook = xlsx.readFile('c:/Users/ACER/OneDrive/Desktop/files/otel_verileri_v2.xlsx');
const genInfo = xlsx.utils.sheet_to_json(workbook.Sheets['Otel Genel Bilgileri']);
const roomInfo = xlsx.utils.sheet_to_json(workbook.Sheets['Oda Tipleri ve Görseller']);
const linkGuide = xlsx.utils.sheet_to_json(workbook.Sheets['Görsel Link Rehberi']);

const data = {
  hotels: genInfo,
  rooms: roomInfo,
  links: linkGuide
};

fs.writeFileSync('c:/Users/ACER/saliabitour/scratch/all_hotel_links.json', JSON.stringify(data, null, 2));
console.log('Linkler başarıyla çıkarıldı ve all_hotel_links.json dosyasına kaydedildi.');
