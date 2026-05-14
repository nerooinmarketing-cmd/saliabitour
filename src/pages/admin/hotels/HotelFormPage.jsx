import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useData } from '../../../contexts/DataContext';
import { amenityIcons } from '../../../data/hotels';

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

// Oda Görsel Grubu Bileşeni
const RoomImagesField = ({ roomIndex, values, onChange }) => {
  const addImage = () => {
    const link = prompt('Görsel linkini yapıştırın:');
    if (link) {
      const newImages = [...(values || []), link];
      onChange(newImages);
    }
  };

  const updateImage = (idx, newLink) => {
    const newImages = [...values];
    newImages[idx] = newLink;
    onChange(newImages);
  };

  const removeImage = (idx) => {
    const newImages = values.filter((_, i) => i !== idx);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Oda Galerisi (Fotoğraf Linkleri)</label>
        <button type="button" onClick={addImage} className="flex items-center gap-2 px-4 py-2 bg-[#056BFD] text-white rounded-xl text-[10px] font-black hover:bg-[#0054cb] transition-all shadow-md">
          <span className="material-symbols-outlined text-sm">add_link</span>
          YENİ FOTOĞRAF LİNKİ EKLE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(values || []).map((img, idx) => (
          <div key={idx} className="flex gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm group hover:shadow-md transition-all">
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-50">
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Görsel URL #{idx + 1}</span>
                <button type="button" onClick={() => removeImage(idx)} className="text-red-500 hover:text-red-700 transition-colors">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
              <input 
                type="url" 
                value={img} 
                onChange={(e) => updateImage(idx, e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-medium outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="https://..."
              />
            </div>
          </div>
        ))}
      </div>
      
      {(!values || values.length === 0) && (
        <div className="py-10 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-slate-300">
          <span className="material-symbols-outlined text-4xl mb-2 font-light">link</span>
          <span className="text-[10px] font-black uppercase tracking-widest">Henüz galeri görseli eklenmedi</span>
        </div>
      )}
    </div>
  );
};

export default function HotelFormPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const { hotels, saveHotel } = useData();
  const isEditing = !!id;
  const existingHotel = isEditing ? hotels.find(h => h.id === id) : null;

  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: existingHotel || {
      status: 'active',
      isFeatured: false,
      category: 5,
      amenities: [],
      roomTypes: [{ nameTR: '', price: 0, images: [], size: '28-32', capacity: '2+1', bed: 'Çift / Twin', view: 'Kara Manzaralı', features: 'Balkon, Klima, Minibar, LCD TV, Kasa, Wi-Fi' }],
      images: ['', '', '', ''],
      concept: 'Ultra Her Şey Dahil',
      sea: 'Denize Sıfır'
    }
  });

  const { fields: roomFields, append: appendRoom, remove: removeRoom } = useFieldArray({ control, name: 'roomTypes' });
  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({ control, name: 'images' });

  const onSubmit = (data) => {
    // Odalara ID ekle (yoksa)
    const updatedRoomTypes = data.roomTypes.map(room => ({
      ...room,
      id: room.id || Math.random().toString(36).substr(2, 9)
    }));

    saveHotel({
      ...data,
      roomTypes: updatedRoomTypes,
      id: id || Date.now().toString()
    });
    alert('Otel başarıyla sisteme kaydedildi!');
    navigate('/admin/hotels');
  };

  return (
    <div className="max-w-6xl mx-auto pb-32">
      {/* ÜST BAR (SABİT) */}
      <div className="flex justify-between items-center mb-10 sticky top-0 bg-[#f8f9fb]/90 backdrop-blur-md py-6 z-50 px-4 -mx-4 border-b border-slate-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">
            {isEditing ? 'Oteli Düzenle' : 'Yeni Otel Ekle'}
          </h1>
          <p className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-widest">BYTOUR PROFESYONEL OTEL YÖNETİM MODÜLÜ</p>
        </div>
        <div className="flex gap-4">
          <button type="button" onClick={() => navigate('/admin/hotels')} className="px-6 py-3 rounded-2xl font-black text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">İPTAL</button>
          <button type="submit" form="hotelForm" className="bg-[#056BFD] text-white px-10 py-3 rounded-2xl font-black hover:bg-[#0054cb] flex items-center gap-3 shadow-xl shadow-blue-500/30 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-lg">verified</span> KAYDET VE YAYINLA
          </button>
        </div>
      </div>

      <form id="hotelForm" onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        
        {/* 1. BÖLÜM: TEMEL BİLGİLER */}
        <section className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
          <div className="flex items-center gap-4 mb-10 border-b border-slate-50 pb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#056BFD] font-black text-xl italic">1</div>
            <div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Genel Otel Bilgileri</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Otelin kimlik ve konum bilgilerini giriniz</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Otel Adı (TR)</label>
                <input {...register('nameTR', { required: true })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-slate-700 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner" placeholder="Örn: Titanic Deluxe Lara" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Otel Adı (EN)</label>
                <input {...register('nameEN', { required: true })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-slate-700 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Konum</label>
                <input {...register('location')} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-slate-700 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner" placeholder="Antalya / Belek" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Yıldız</label>
                  <select {...register('category', { valueAsNumber: true })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-slate-700 focus:ring-4 focus:ring-blue-100 outline-none appearance-none shadow-inner">
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Yıldızlı Otel</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Konsept</label>
                  <input {...register('concept')} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-slate-700 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner" />
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-[2rem] p-8 space-y-6 flex flex-col justify-center border border-slate-100 shadow-inner">
              <label className="flex items-center gap-4 cursor-pointer group p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100">
                <input type="checkbox" {...register('isFeatured')} className="w-6 h-6 text-[#056BFD] rounded-lg border-slate-200 focus:ring-0" />
                <span className="text-sm font-black text-slate-700 group-hover:text-[#056BFD] tracking-tighter uppercase">ANA SAYFADA ÖNE ÇIKAR</span>
              </label>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Yayın Durumu</label>
                <select {...register('status')} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 focus:ring-0 outline-none shadow-sm">
                  <option value="active">AKTİF (YAYINDA)</option>
                  <option value="inactive">PASİF (GİZLİ)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Detaylı Açıklama (TR)</label>
              <textarea {...register('descriptionTR')} rows="6" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-medium text-slate-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none shadow-inner" placeholder="Otel hakkında genel tanıtım metni..."></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Detaylı Açıklama (EN)</label>
              <textarea {...register('descriptionEN')} rows="6" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-medium text-slate-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none shadow-inner"></textarea>
            </div>
          </div>
        </section>

        {/* 2. BÖLÜM: TESİS OLANAKLARI */}
        <section className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
          <div className="flex items-center gap-4 mb-10 border-b border-slate-50 pb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#056BFD] font-black text-xl italic">2</div>
            <div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Otel Özellikleri ve Olanaklar</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Sitede görünecek özellik ikonlarını seçin</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Object.entries(amenityIcons).map(([key, amenity]) => (
              <label key={key} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-white hover:shadow-xl hover:border-blue-500/20 transition-all border-2 border-transparent has-[:checked]:border-[#056BFD] has-[:checked]:bg-white shadow-sm group">
                <input type="checkbox" value={key} {...register('amenities')} className="w-6 h-6 text-[#056BFD] rounded-lg border-slate-300 focus:ring-0" />
                <span className="material-symbols-outlined text-[#056BFD] text-2xl group-hover:scale-110 transition-transform">{amenity.icon}</span>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter leading-tight">{lang === 'tr' ? amenity.tr : amenity.en}</span>
              </label>
            ))}
          </div>
        </section>

        {/* 3. BÖLÜM: ODA TİPLERİ (TEK ALAN) */}
        <section className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
          <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#056BFD] font-black text-xl italic">3</div>
              <div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Oda Seçenekleri ve Fiyatlandırma</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Odaları tüm teknik detaylarıyla buradan yönetin</p>
              </div>
            </div>
            <button type="button" onClick={() => appendRoom({ nameTR: '', price: 0, image: '', size: '30-35', capacity: '2+1', bed: 'Double / Twin', view: 'Deniz Manzaralı', features: 'Balkon, Klima, Minibar, Kasa, Wi-Fi' })} className="bg-slate-800 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase hover:bg-black transition-all flex items-center gap-3 shadow-lg">
              <span className="material-symbols-outlined text-lg">add_home_work</span> YENİ ODA TİPİ EKLE
            </button>
          </div>

          <div className="space-y-16">
            {roomFields.map((field, index) => (
              <div key={field.id} className="p-10 border border-slate-100 rounded-[3rem] bg-[#fbfbfc] relative animate-in zoom-in duration-500 hover:shadow-2xl hover:bg-white transition-all group">
                <div className="absolute -top-5 left-10 bg-[#003580] text-white px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl">ODA KATEGORİSİ #{index + 1}</div>
                <button type="button" onClick={() => removeRoom(index)} className="absolute -top-5 -right-5 w-12 h-12 bg-white text-red-500 rounded-full shadow-2xl border border-slate-100 flex items-center justify-center hover:bg-red-50 transition-all z-10"><span className="material-symbols-outlined">delete_sweep</span></button>

                <div className="grid lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-12">
                    <RoomImagesField 
                      roomIndex={index} 
                      values={watch(`roomTypes.${index}.images`)} 
                      onChange={(newImgs) => setValue(`roomTypes.${index}.images`, newImgs)} 
                    />
                  </div>

                  <div className="lg:col-span-12 space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Oda Tanımı (TR)</label>
                        <input {...register(`roomTypes.${index}.nameTR`)} className="w-full px-5 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-black text-slate-700 focus:ring-4 focus:ring-blue-100 outline-none shadow-sm" placeholder="Örn: Deluxe Deniz Manzaralı Suite" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Gecelik Başlangıç Fiyatı (₺)</label>
                        <input type="number" {...register(`roomTypes.${index}.price`)} className="w-full px-5 py-4 bg-white border border-slate-100 rounded-2xl text-xl font-black text-[#056BFD] focus:ring-4 focus:ring-blue-100 outline-none shadow-sm" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {[
                        { label: 'Genişlik (m²)', name: 'size' },
                        { label: 'Kapasite', name: 'capacity' },
                        { label: 'Yatak Tipi', name: 'bed' },
                        { label: 'Manzara', name: 'view' }
                      ].map(item => (
                        <div key={item.name} className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter pl-1">{item.label}</label>
                          <input {...register(`roomTypes.${index}.${item.name}`)} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-xs font-black text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none shadow-sm" />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Oda Özellikleri (Virgül ile ayırın)</label>
                      <textarea {...register(`roomTypes.${index}.features`)} rows="2" className="w-full px-5 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-medium text-slate-600 focus:ring-4 focus:ring-blue-100 outline-none shadow-sm resize-none" placeholder="Balkon, Klima, Minibar, LCD TV, Kasa, Wi-Fi..."></textarea>
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
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Otel Galerisi</h2>
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
                  <div className="bg-slate-100 px-5 py-4 rounded-l-2xl text-slate-400 text-xs font-bold border border-r-0 border-slate-200">saliabitour.com/hotels/</div>
                  <input {...register('slug', { required: true })} className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-r-2xl text-sm font-mono font-black text-[#056BFD] focus:ring-0 outline-none" placeholder="titanic-deluxe-lara" />
                </div>
                <p className="text-[10px] text-slate-400 font-bold mt-2 italic px-1">* Otomatik oluşturulur, gerekirse manuel düzenleyin.</p>
              </div>
              <div className="p-8 bg-[#003580] rounded-[2rem] text-white space-y-4 shadow-xl mt-auto">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">verified</span>
                  <span className="font-black uppercase tracking-widest text-[10px]">Yönetici Bilgi Notu</span>
                </div>
                <p className="text-xs font-medium leading-relaxed opacity-80 italic">Tüm bilgileri eksiksiz girdiğinizden emin olun. Kaydettiğiniz anda otel otomatik olarak tüm sistemde (ana sayfa, listeler, arama sonuçları) güncellenecektir.</p>
              </div>
            </div>
          </section>
        </div>

      </form>
    </div>
  );
}
