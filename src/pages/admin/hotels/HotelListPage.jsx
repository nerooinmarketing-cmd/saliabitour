import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useData } from '../../../contexts/DataContext';
import * as XLSX from 'xlsx';

export default function HotelListPage() {
  const { t, lang } = useLanguage();
  const { hotels, saveHotel, deleteHotel } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  // 2. EXCEL'DEN VERİ OKUMA VE TOPLU YÜKLEME
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const bstr = event.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        const newHotels = data.map((row, index) => {
          const roomTypes = [];
          for (let i = 1; i <= 3; i++) {
            if (row[`ODA ${i} Ad`]) {
              const details = row[`ODA ${i} Detay`]?.split(',') || [];
              roomTypes.push({
                id: `room-${Date.now()}-${index}-${i}`,
                nameTR: row[`ODA ${i} Ad`],
                price: Number(row[`ODA ${i} Fiyat`]) || 0,
                size: details[0]?.trim() || '',
                bed: details[1]?.trim() || '',
                view: details[2]?.trim() || '',
                features: row[`ODA ${i} Ozellik`] || ''
              });
            }
          }

          return {
            id: String(hotelList.length + index + 100),
            nameTR: row['Otel Adı (TR)'],
            nameEN: row['Otel Adı (EN)'],
            location: row['Konum'],
            category: Number(row['Yıldız']) || 5,
            concept: row['Konsept'],
            descriptionTR: row['Açıklama TR'],
            descriptionEN: row['Açıklama EN'],
            slug: row['Slug'] || row['Otel Adı (TR)'].toLowerCase().replace(/ /g, '-'),
            isFeatured: String(row['One Cikan (E/H)']).toUpperCase() === 'E',
            status: row['Durum'] === 'Aktif' ? 'active' : 'inactive',
            amenities: String(row['Olanaklar'] || '').split(',').map(a => a.trim()).filter(a => a),
            images: String(row['Gorseller'] || '').split(',').map(i => i.trim()).filter(i => i),
            roomTypes
          };
        });

        newHotels.forEach(h => saveHotel(h));
        alert(`${newHotels.length} adet otel ve tüm oda detayları başarıyla sisteme aktarıldı!`);
      } catch (error) {
        alert("Excel işlenirken bir hata oluştu. Lütfen şablonu kontrol edin.");
        console.error(error);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleToggleStatus = (id) => {
    const hotel = hotels.find(h => h.id === id);
    if (hotel) {
      saveHotel({ ...hotel, status: hotel.status === 'active' ? 'inactive' : 'active' });
    }
  };

  const handleDelete = (id) => {
    if (confirm('Bu oteli silmek istediğinize emin misiniz?')) {
      deleteHotel(id);
    }
  };

  const filtered = hotels.filter(h => {
    const name = lang === 'tr' ? (h.nameTR || '') : (h.nameEN || '');
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">{t('admin.hotels.title')}</h1>
          <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-[0.2em]">{t('admin.hotels.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a 
            href="/api/download-hotel-template" 
            className="bg-white text-slate-600 border border-slate-200 px-6 py-3.5 rounded-2xl font-black hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm text-[10px] uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            ŞABLON İNDİR
          </a>
          <label className="bg-green-600 text-white px-6 py-3.5 rounded-2xl font-black hover:bg-green-700 transition-all flex items-center gap-2 shadow-xl shadow-green-500/20 cursor-pointer text-[10px] uppercase tracking-widest">
            <span className="material-symbols-outlined text-lg">upload_file</span>
            EXCEL'DEN YÜKLE
            <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleExcelUpload} />
          </label>
          <Link to="/admin/hotels/new" className="bg-[#056BFD] text-white px-8 py-3.5 rounded-2xl font-black hover:bg-[#0054cb] transition-all flex items-center gap-2 shadow-xl shadow-blue-500/20 active:scale-95 text-[10px] uppercase tracking-widest">
            <span className="material-symbols-outlined text-lg">add</span>
            YENİ OTEL EKLE
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl font-light">search</span>
            <input 
              type="text" 
              placeholder="Otel ismi ile ara..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-black focus:outline-none focus:border-[#056BFD] focus:ring-4 focus:ring-blue-50 transition-all shadow-inner"
            />
          </div>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
            TOPLAM {filtered.length} OTEL LİSTELENİYOR
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-[10px] uppercase bg-slate-50/50 text-slate-400 font-black border-b border-slate-100 tracking-[0.2em]">
              <tr>
                <th className="px-10 py-6">OTEL VE KONSEPT</th>
                <th className="px-6 py-6">KATEGORİ</th>
                <th className="px-6 py-6">KONUM</th>
                <th className="px-6 py-6 text-center">ODA SAYISI</th>
                <th className="px-6 py-6">DURUM</th>
                <th className="px-10 py-6 text-right">İŞLEMLER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(hotel => (
                <tr key={hotel.id} className="hover:bg-blue-50/30 transition-all group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <img src={hotel.images[0] || 'https://via.placeholder.com/150'} alt="" className="w-16 h-16 rounded-[1.2rem] object-cover shadow-md border-2 border-white group-hover:scale-105 transition-transform" />
                        {hotel.isFeatured && (
                          <div className="absolute -top-3 -right-3 w-7 h-7 bg-[#fcc01a] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-black text-slate-800 text-lg tracking-tight leading-tight">{lang === 'tr' ? hotel.nameTR : hotel.nameEN}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{hotel.concept || 'HER ŞEY DAHİL'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex text-[#fcc01a]">
                      {[...Array(hotel.category || 5)].map((_, i) => <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                    </div>
                  </td>
                  <td className="px-6 py-6 font-black text-slate-500 text-[11px] uppercase tracking-wider italic">{hotel.location}</td>
                  <td className="px-6 py-6 text-center">
                    <div className="bg-blue-50 text-[#0073bc] text-[10px] font-black px-4 py-2 rounded-xl inline-block uppercase shadow-sm border border-blue-100">
                      {(hotel.roomTypes || []).length} TİP ODA
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <button 
                      onClick={() => handleToggleStatus(hotel.id)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all shadow-sm active:scale-95 ${hotel.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${hotel.status === 'active' ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-slate-400'}`}></div>
                      {hotel.status === 'active' ? 'AKTİF' : 'PASİF'}
                    </button>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                      <Link to={`/admin/hotels/${hotel.id}/edit`} className="p-3 text-slate-400 hover:text-[#056BFD] hover:bg-white rounded-2xl transition-all shadow-sm hover:shadow-xl border border-transparent hover:border-blue-100" title="Düzenle">
                        <span className="material-symbols-outlined text-[24px]">edit_square</span>
                      </Link>
                      <button onClick={() => handleDelete(hotel.id)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-white rounded-2xl transition-all shadow-sm hover:shadow-xl border border-transparent hover:border-red-100" title="Sil">
                        <span className="material-symbols-outlined text-[24px]">delete_forever</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
