import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useData } from '../../../contexts/DataContext';
import { tourCategories } from '../../../data/tours';

// Akıllı Görsel Bileşeni (Object-Fit ve Önizleme Destekli)
const ImageUploadField = ({ label, value, onChange, onRemove }) => {
  const [mode, setMode] = useState('link');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onChange(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-center px-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
        <button 
          type="button" 
          onClick={() => fileInputRef.current?.click()}
          className="text-[9px] font-black text-[#056BFD] hover:underline uppercase tracking-widest"
        >
          BİLGİSAYARDAN YÜKLE
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="w-20 h-20 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center group relative shadow-inner">
          {value ? (
            <>
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button type="button" onClick={onRemove} className="w-8 h-8 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/40"><span className="material-symbols-outlined text-sm">delete</span></button>
              </div>
            </>
          ) : (
            <span className="material-symbols-outlined text-slate-200 text-2xl font-light">link</span>
          )}
        </div>

        <div className="flex-1">
          <input 
            type="url" 
            placeholder="Görsel URL linkini buraya yapıştırın..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#056BFD] outline-none transition-all shadow-inner"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          />
          <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-tight pl-1 italic">
            * Dış bağlantı (link) kullanımı tavsiye edilir.
          </p>
        </div>
      </div>
    </div>
  );
};

export default function TourFormPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const { tours, saveTour } = useData();
  const isEditing = !!id;
  const existingTour = isEditing ? tours.find(h => h.id === id) : null;

  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: existingTour || {
      status: 'active',
      featured: false,
      categoryTR: 'Kültür & Tarih',
      categoryEN: 'Culture & History',
      included: 'Rehberlik, Konaklama, Kahvaltı, Transfer',
      excluded: 'Müze girişleri, Öğle yemekleri',
      itinerary: [{ day: 1, titleTR: '', descriptionTR: '' }],
      images: ['', '', '', ''],
      duration: '3 Gün / 2 Gece',
      maxParticipants: 20
    }
  });

  const { fields: itineraryFields, append: appendDay, remove: removeDay } = useFieldArray({ control, name: 'itinerary' });
  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({ control, name: 'images' });

  const onSubmit = (data) => {
    saveTour({
      ...data,
      id: id || Date.now().toString()
    });
    alert('Tur başarıyla sisteme kaydedildi!');
    navigate('/admin/tours');
  };

  return (
    <div className="max-w-6xl mx-auto pb-32">
      {/* ÜST BAR (SABİT) */}
      <div className="flex justify-between items-center mb-10 sticky top-0 bg-[#f8f9fb]/90 backdrop-blur-md py-6 z-50 px-4 -mx-4 border-b border-slate-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">
            {isEditing ? 'Turu Düzenle' : 'Yeni Tur Ekle'}
          </h1>
          <p className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-widest">BYTOUR PROFESYONEL TUR YÖNETİM MODÜLÜ</p>
        </div>
        <div className="flex gap-4">
          <button type="button" onClick={() => navigate('/admin/tours')} className="px-6 py-3 rounded-2xl font-black text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">İPTAL</button>
          <button type="submit" form="tourForm" className="bg-[#056BFD] text-white px-10 py-3 rounded-2xl font-black hover:bg-[#0054cb] flex items-center gap-3 shadow-xl shadow-blue-500/30 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-lg">verified</span> KAYDET VE YAYINLA
          </button>
        </div>
      </div>

      <form id="tourForm" onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        
        {/* 1. BÖLÜM: TEMEL BİLGİLER */}
        <section className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
          <div className="flex items-center gap-4 mb-10 border-b border-slate-50 pb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#056BFD] font-black text-xl italic">1</div>
            <div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Genel Tur Bilgileri</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Turun kimlik, konum ve fiyatlandırma bilgilerini giriniz</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Tur Adı (TR)</label>
                <input {...register('titleTR', { required: true })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-slate-700 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner" placeholder="Örn: Kapadokya Rüyası" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Tur Adı (EN)</label>
                <input {...register('titleEN', { required: true })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-slate-700 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner" />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Kategori</label>
                <select {...register('categoryTR')} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-slate-700 focus:ring-4 focus:ring-blue-100 outline-none appearance-none shadow-inner">
                  <option value="Kültür & Tarih">Kültür & Tarih</option>
                  <option value="Deniz & Güneş">Deniz & Güneş</option>
                  <option value="Doğa & Macera">Doğa & Macera</option>
                  <option value="Yurtdışı">Yurtdışı</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Lokasyon (Bölge)</label>
                <input {...register('location')} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-slate-700 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner" placeholder="Örn: Nevşehir / Türkiye" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Kişi Başı Fiyat (₺)</label>
                <input type="number" {...register('price', { required: true })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-black text-[#056BFD] focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Süre</label>
                  <input {...register('duration')} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-slate-700 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner" placeholder="3 Gün 2 Gece" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Kontenjan</label>
                  <input type="number" {...register('maxParticipants')} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-slate-700 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner" />
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-[2rem] p-8 space-y-6 flex flex-col justify-center border border-slate-100 shadow-inner">
              <label className="flex items-center gap-4 cursor-pointer group p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100">
                <input type="checkbox" {...register('featured')} className="w-6 h-6 text-[#056BFD] rounded-lg border-slate-200 focus:ring-0" />
                <span className="text-sm font-black text-slate-700 group-hover:text-[#056BFD] tracking-tighter uppercase">ANA SAYFADA ÖNE ÇIKAR</span>
              </label>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Yayın Durumu</label>
                <select {...register('status')} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 focus:ring-0 outline-none shadow-sm">
                  <option value="active">AKTİF (YAYINDA)</option>
                  <option value="inactive">PASİF (GİZLİ)</option>
                  <option value="soldout">TÜKENDİ</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Detaylı Açıklama (TR)</label>
              <textarea {...register('descriptionTR')} rows="4" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-medium text-slate-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none shadow-inner" placeholder="Tur hakkında genel tanıtım metni..."></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Detaylı Açıklama (EN)</label>
              <textarea {...register('descriptionEN')} rows="4" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-medium text-slate-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none shadow-inner"></textarea>
            </div>
          </div>
        </section>

        {/* 2. BÖLÜM: DAHİL & HARİCİ */}
        <section className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
          <div className="flex items-center gap-4 mb-10 border-b border-slate-50 pb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#056BFD] font-black text-xl italic">2</div>
            <div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Hizmet Detayları</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Fiyata dahil olan ve olmayan hizmetleri belirtin (Virgülle ayırın)</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2 text-green-600">
                <span className="material-symbols-outlined">check_circle</span>
                <label className="text-[10px] font-black uppercase tracking-widest">FİYATA DAHİL OLANLAR</label>
              </div>
              <textarea {...register('included')} rows="3" className="w-full px-5 py-4 bg-green-50/50 border border-green-100 rounded-[2rem] text-sm font-medium text-slate-700 focus:ring-4 focus:ring-green-100 outline-none transition-all resize-none shadow-inner" placeholder="Rehberlik, Konaklama, Kahvaltı..."></textarea>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2 text-red-500">
                <span className="material-symbols-outlined">cancel</span>
                <label className="text-[10px] font-black uppercase tracking-widest">FİYATA DAHİL OLMAYANLAR (EKSTRA)</label>
              </div>
              <textarea {...register('excluded')} rows="3" className="w-full px-5 py-4 bg-red-50/50 border border-red-100 rounded-[2rem] text-sm font-medium text-slate-700 focus:ring-4 focus:ring-red-100 outline-none transition-all resize-none shadow-inner" placeholder="Müze girişleri, Öğle yemekleri..."></textarea>
            </div>
          </div>
        </section>

        {/* 3. BÖLÜM: GÜNLÜK PROGRAM */}
        <section className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
          <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#056BFD] font-black text-xl italic">3</div>
              <div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Günlük Tur Programı (Itinerary)</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Turun gün gün rotasını ve etkinliklerini girin</p>
              </div>
            </div>
            <button type="button" onClick={() => appendDay({ day: itineraryFields.length + 1, titleTR: '', descriptionTR: '' })} className="bg-slate-800 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase hover:bg-black transition-all flex items-center gap-3 shadow-lg">
              <span className="material-symbols-outlined text-lg">add_location_alt</span> YENİ GÜN EKLE
            </button>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-[35px] before:w-1 before:bg-slate-100">
            {itineraryFields.map((field, index) => (
              <div key={field.id} className="relative flex gap-8 group">
                <div className="w-[70px] h-[70px] bg-white border-4 border-slate-100 rounded-full flex items-center justify-center font-black text-2xl text-slate-300 z-10 group-hover:border-[#056BFD] group-hover:text-[#056BFD] transition-colors shrink-0 shadow-sm">
                  {index + 1}
                </div>
                
                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-[2rem] p-8 relative animate-in fade-in slide-in-from-right-8 duration-500 shadow-sm hover:shadow-md transition-all">
                  <button type="button" onClick={() => removeDay(index)} className="absolute -top-3 -right-3 w-10 h-10 bg-white text-red-500 rounded-full shadow-lg border border-slate-100 flex items-center justify-center hover:bg-red-50 transition-all"><span className="material-symbols-outlined text-sm">close</span></button>
                  
                  <div className="grid md:grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{index + 1}. GÜN BAŞLIĞI / ROTA</label>
                      <input {...register(`itinerary.${index}.titleTR`)} className="w-full px-5 py-4 bg-white border border-slate-100 rounded-xl text-sm font-black text-slate-800 focus:ring-4 focus:ring-blue-100 outline-none shadow-sm" placeholder="Örn: Avanos Gezisi ve Çömlek Yapımı" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">GÜNÜN DETAYLI AÇIKLAMASI</label>
                      <textarea {...register(`itinerary.${index}.descriptionTR`)} rows="3" className="w-full px-5 py-4 bg-white border border-slate-100 rounded-xl text-sm font-medium text-slate-600 focus:ring-4 focus:ring-blue-100 outline-none shadow-sm resize-none" placeholder="Sabah otelde yapılan kahvaltının ardından..."></textarea>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. BÖLÜM: GALERİ VE SEO */}
        <div className="grid lg:grid-cols-2 gap-12">
          <section className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#056BFD] font-black text-xl italic">4</div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Tur Galerisi</h2>
              </div>
              <button type="button" onClick={() => appendImage('')} className="text-[#056BFD] font-black text-[10px] uppercase hover:underline tracking-widest">FOTOĞRAF EKLE</button>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {imageFields.map((field, index) => (
                <ImageUploadField key={field.id} label={`GALERİ GÖRSELİ #${index + 1}`} value={watch(`images.${index}`)} onChange={(val) => setValue(`images.${index}`, val)} onRemove={() => removeImage(index)} />
              ))}
            </div>
          </section>

          <section className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100 flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#056BFD] font-black text-xl italic">5</div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">SEO ve Link Ayarları</h2>
            </div>
            <div className="space-y-6 flex-1">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Arama Motoru Linki (SLUG)</label>
                <div className="flex items-center">
                  <div className="bg-slate-100 px-5 py-4 rounded-l-2xl text-slate-400 text-xs font-bold border border-r-0 border-slate-200">saliabitour.com/tours/</div>
                  <input {...register('slug', { required: true })} className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-r-2xl text-sm font-mono font-black text-[#056BFD] focus:ring-0 outline-none" placeholder="kapadokya-ruyasi" />
                </div>
                <p className="text-[10px] text-slate-400 font-bold mt-2 italic px-1">* Otomatik oluşturulur, gerekirse manuel düzenleyin.</p>
              </div>
              <div className="p-8 bg-[#003580] rounded-[2rem] text-white space-y-4 shadow-xl mt-auto">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">verified</span>
                  <span className="font-black uppercase tracking-widest text-[10px]">Yönetici Bilgi Notu</span>
                </div>
                <p className="text-xs font-medium leading-relaxed opacity-80 italic">Tüm bilgileri eksiksiz girdiğinizden emin olun. Kaydettiğiniz anda tur otomatik olarak yayına girecek ve rezervasyon kabul etmeye başlayacaktır.</p>
              </div>
            </div>
          </section>
        </div>

      </form>
    </div>
  );
}
