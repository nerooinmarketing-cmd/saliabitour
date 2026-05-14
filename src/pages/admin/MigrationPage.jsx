import { useState } from 'react';
import { tours } from '../../data/tours';
import { hotels } from '../../data/hotels';
import { customers } from '../../data/customers';
import { reservations } from '../../data/reservations';
import { siteContent, blogPosts } from '../../data/content';
import { addTour } from '../../services/tourService';
import { addHotel } from '../../services/hotelService';
import { addCustomer } from '../../services/customerService';
import { addReservation } from '../../services/reservationService';
import { addContent } from '../../services/contentService';

export default function MigrationPage() {
  const [logs, setLogs] = useState([]);
  const [isMigrating, setIsMigrating] = useState(false);

  const addLog = (msg) => setLogs(prev => [...prev, msg]);

  // Firebase rejects undefined fields. This strips them out.
  const cleanPayload = (obj) => JSON.parse(JSON.stringify(obj));

  // If Firebase loses connection or hangs, this prevents infinite pending
  const withTimeout = (promise, ms = 10000) => {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('İstek zaman aşımına uğradı (Timeout)')), ms))
    ]);
  };

  const migrateTours = async () => {
    addLog('Turlar aktarılıyor...');
    let count = 0;
    for (const tour of tours) {
      try {
        await withTimeout(addTour(cleanPayload(tour), String(tour.id)));
        count++;
      } catch (err) {
        addLog(`Hata (Tour ${tour.id}): ${err.message}`);
      }
    }
    addLog(`✅ Toplam ${count} tur aktarıldı.`);
  };

  const migrateHotels = async () => {
    addLog('Oteller aktarılıyor...');
    let count = 0;
    for (const hotel of hotels) {
      try {
        await withTimeout(addHotel(cleanPayload(hotel), String(hotel.id)));
        count++;
      } catch (err) {
        addLog(`Hata (Hotel ${hotel.id}): ${err.message}`);
      }
    }
    addLog(`✅ Toplam ${count} otel aktarıldı.`);
  };

  const migrateCustomers = async () => {
    addLog('Müşteriler aktarılıyor...');
    let count = 0;
    for (const customer of customers) {
      try {
        await withTimeout(addCustomer(cleanPayload(customer), String(customer.id)));
        count++;
      } catch (err) {
        addLog(`Hata (Customer ${customer.id}): ${err.message}`);
      }
    }
    addLog(`✅ Toplam ${count} müşteri aktarıldı.`);
  };

  const migrateReservations = async () => {
    addLog('Rezervasyonlar aktarılıyor...');
    let count = 0;
    for (const reservation of reservations) {
      try {
        await withTimeout(addReservation(cleanPayload(reservation), String(reservation.id)));
        count++;
      } catch (err) {
        addLog(`Hata (Reservation ${reservation.id}): ${err.message}`);
      }
    }
    addLog(`✅ Toplam ${count} rezervasyon aktarıldı.`);
  };

  const migrateContent = async () => {
    addLog('İçerikler (Site Content, FAQ, Blog) aktarılıyor...');
    try {
      let blogCount = 0;
      for (const post of blogPosts) {
        await withTimeout(addContent('blogs', cleanPayload(post), String(post.id)));
        blogCount++;
      }
      addLog(`✅ ${blogCount} blog yazısı aktarıldı.`);

      let faqCount = 0;
      for (let i = 0; i < siteContent.faq.length; i++) {
        await withTimeout(addContent('faqs', cleanPayload(siteContent.faq[i]), `faq_${i}`));
        faqCount++;
      }
      addLog(`✅ ${faqCount} SSS aktarıldı.`);

      const settings = cleanPayload({
        companyName: siteContent.companyName,
        phone: siteContent.phone,
        whatsapp: siteContent.whatsapp,
        contactEmail: siteContent.contactEmail,
        address: siteContent.address,
        heroTitle: siteContent.heroTitle,
        heroSubtitle: siteContent.heroSubtitle,
        aboutText: siteContent.aboutText
      });
      await withTimeout(addContent('site_settings', settings, 'main_settings'));
      addLog(`✅ Site ayarları aktarıldı.`);

    } catch (err) {
      addLog(`Hata (Content): ${err.message}`);
    }
  };

  const handleMigrateAll = async () => {
    setIsMigrating(true);
    setLogs([]);
    
    await migrateTours();
    await migrateHotels();
    await migrateCustomers();
    await migrateReservations();
    await migrateContent();

    setIsMigrating(false);
    addLog('🎉 TÜM AKTARIMLAR TAMAMLANDI!');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Firestore Data Migration</h1>
      <p className="text-slate-500 mb-8">
        Bu sayfa `src/data` altındaki sahte (mock) verileri okuyup Firestore'a aktarmak için kullanılır.
        Aktarım tamamlandıktan sonra bu sayfayı ve `data/` dosyalarını silebilirsiniz.
      </p>

      <div className="flex gap-4 mb-8 flex-wrap">
        <button disabled={isMigrating} onClick={migrateTours} className="px-4 py-2 bg-blue-500 text-white rounded font-bold hover:bg-blue-600">Turları Aktar</button>
        <button disabled={isMigrating} onClick={migrateHotels} className="px-4 py-2 bg-green-500 text-white rounded font-bold hover:bg-green-600">Otelleri Aktar</button>
        <button disabled={isMigrating} onClick={migrateCustomers} className="px-4 py-2 bg-purple-500 text-white rounded font-bold hover:bg-purple-600">Müşterileri Aktar</button>
        <button disabled={isMigrating} onClick={migrateReservations} className="px-4 py-2 bg-orange-500 text-white rounded font-bold hover:bg-orange-600">Rezervasyonları Aktar</button>
        <button disabled={isMigrating} onClick={migrateContent} className="px-4 py-2 bg-teal-500 text-white rounded font-bold hover:bg-teal-600">İçerikleri Aktar</button>
        
        <button disabled={isMigrating} onClick={handleMigrateAll} className="px-6 py-2 bg-red-600 text-white rounded font-black hover:bg-red-700 ml-auto">
          {isMigrating ? 'Aktarılıyor...' : 'HEPSİNİ AKTAR'}
        </button>
      </div>

      <div className="bg-slate-900 text-green-400 p-6 rounded-xl font-mono text-sm h-96 overflow-y-auto">
        {logs.length === 0 ? <span className="text-slate-600">Bekleniyor...</span> : logs.map((log, i) => (
          <div key={i} className="mb-1">{log}</div>
        ))}
      </div>
    </div>
  );
}
