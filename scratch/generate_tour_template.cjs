const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const templateData = [
  {
    'Tur Adı (TR)': 'Kapadokya Rüyası',
    'Tur Adı (EN)': 'Cappadocia Dream',
    'Kategori': 'Kültür & Tarih',
    'Lokasyon': 'Kapadokya, Türkiye',
    'Fiyat (₺)': 8500,
    'Kontenjan': 20,
    'Süre': '3 Gün / 2 Gece',
    'Açıklama (TR)': 'Peri bacalarının gizemli dünyasına harika bir yolculuk...',
    'Açıklama (EN)': 'A wonderful journey to the mysterious world of fairy chimneys...',
    'Slug (Link)': 'kapadokya-ruyasi',
    'Öne Çıkan (E/H)': 'E',
    'Durum (Aktif/Pasif)': 'Aktif',
    'Dahil Olanlar (Virgülle)': 'Rehberlik, Konaklama, Kahvaltı, Transfer',
    'Harici Olanlar (Virgülle)': 'Müze girişleri, Öğle yemekleri, Balon turu',
    'Görseller (Linkleri virgülle)': 'https://images.com/kapadokya1.jpg, https://images.com/kapadokya2.jpg',
    'GÜN 1 Başlık': 'Avanos ve Çömlek Yapımı',
    'GÜN 1 Detay': 'Sabah otele varış, Avanos gezisi ve çömlek atölyesi ziyareti.',
    'GÜN 2 Başlık': 'Balon Turu ve Ihlara Vadisi',
    'GÜN 2 Detay': 'Gündoğumunda sıcak hava balonu, ardından Ihlara yürüyüşü.',
    'GÜN 3 Başlık': 'Göreme ve Dönüş',
    'GÜN 3 Detay': 'Göreme açık hava müzesi ziyareti ve dönüş yolculuğu.'
  }
];

const ws = XLSX.utils.json_to_sheet(templateData);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Tur_Yukleme_Sablonu");

const wscols = Object.keys(templateData[0]).map(() => ({ wch: 25 }));
ws['!cols'] = wscols;

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const filePath = path.join(publicDir, 'ByTour_Tur_Yukleme_Sablonu.xlsx');
XLSX.writeFile(wb, filePath);

console.log('Tur Sablonu olusturuldu:', filePath);
