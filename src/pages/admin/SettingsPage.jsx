import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { siteContent } from '../../data/content';
import { useSettings } from '../../contexts/SettingsContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const { lang, switchLanguage } = useLanguage();
  const { 
    menus, topBarMenus, uiElements, salesOffices, 
    toggleMenu, toggleTopBarMenu, updateTopBarMenu, updateMenuLabel,
    updateUiElement, addSalesOffice, updateSalesOffice, deleteSalesOffice
  } = useSettings();
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    companyName: siteContent.companyName,
    email: siteContent.contactEmail,
    phone: siteContent.phone,
    whatsapp: siteContent.whatsapp,
    address: lang === 'tr' ? siteContent.address.tr : siteContent.address.en,
    currency: 'TRY',
    timezone: 'Europe/Istanbul',
    emailNotifications: true,
    smsNotifications: false,
    autoConfirm: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Ayarlar</h1>
          <p className="text-slate-500 mt-1">Sistem ve uygulama ayarlarını yönetin</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-[#056BFD] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#0054cb] transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">save</span>
          Kaydet
        </button>
      </div>

      {saved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-green-600">check_circle</span>
          <p className="text-green-700 text-sm font-bold">Ayarlar başarıyla kaydedildi!</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'general', label: 'Genel', icon: 'settings' },
          { id: 'menu', label: 'Menü Yönetimi', icon: 'menu' },
          { id: 'ui', label: 'Arayüz (UI)', icon: 'web' },
          { id: 'offices', label: 'Satış Ofisleri', icon: 'store' },
          { id: 'notifications', label: 'Bildirimler', icon: 'notifications' },
          { id: 'profile', label: 'Profil', icon: 'person' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-[#056BFD] text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
          >
            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Şirket Bilgileri</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Şirket Adı</label>
              <input value={settings.companyName} onChange={e => setSettings({...settings, companyName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#056BFD] outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">E-posta</label>
              <input value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#056BFD] outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Telefon</label>
              <input value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#056BFD] outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">WhatsApp</label>
              <input value={settings.whatsapp} onChange={e => setSettings({...settings, whatsapp: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#056BFD] outline-none" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Adres</label>
              <input value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#056BFD] outline-none" />
            </div>
          </div>
          <hr className="border-slate-100" />
          <h2 className="text-lg font-bold text-slate-800 mb-4">Sistem Ayarları</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Para Birimi</label>
              <select value={settings.currency} onChange={e => setSettings({...settings, currency: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#056BFD] outline-none appearance-none">
                <option value="TRY">Türk Lirası (₺)</option>
                <option value="USD">Amerikan Doları ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Dil</label>
              <select value={lang} onChange={e => switchLanguage(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#056BFD] outline-none appearance-none">
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'menu' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6 animate-fade-in">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Menü Görünürlük Ayarları</h2>
            <p className="text-sm text-slate-500 mt-1">Anasayfadaki (public) logo yanında bulunan menü linklerini buradan açıp kapatabilirsiniz.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {menus.map(menu => (
              <div key={menu.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:shadow-sm transition-all">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400">link</span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{menu.label}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{menu.path}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleMenu(menu.id)}
                  className={`w-12 h-7 rounded-full transition-colors relative ${menu.active ? 'bg-[#056BFD]' : 'bg-slate-200'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${menu.active ? 'translate-x-6' : 'translate-x-1'}`}></div>
                </button>
              </div>
            ))}
          </div>

          <hr className="border-slate-100 my-6" />

          <div>
            <h2 className="text-lg font-bold text-slate-800">Üst Menü (Utility Bar) Ayarları</h2>
            <p className="text-sm text-slate-500 mt-1">Sitenin en üst kısmında yer alan iletişim, eSIM, ofisler gibi ekstra linkleri buradan yönetebilirsiniz.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {topBarMenus.map(menu => (
              <div key={menu.id} className="flex flex-col p-4 border border-slate-100 rounded-xl hover:shadow-sm transition-all bg-slate-50 gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-400">{menu.icon || 'link'}</span>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">{menu.label}</h3>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleTopBarMenu(menu.id)}
                    className={`w-12 h-7 rounded-full transition-colors relative ${menu.active ? 'bg-[#056BFD]' : 'bg-slate-200'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${menu.active ? 'translate-x-6' : 'translate-x-1'}`}></div>
                  </button>
                </div>
                
                {/* Editable Fields */}
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Görünen Değer / Metin</label>
                    <input 
                      value={menu.value || ''} 
                      onChange={e => updateTopBarMenu(menu.id, 'value', e.target.value)} 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#056BFD] outline-none" 
                    />
                  </div>
                  {!menu.isPhone && (
                    <div className="col-span-2">
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Link / Yönlendirme</label>
                      <input 
                        value={menu.path || ''} 
                        onChange={e => updateTopBarMenu(menu.id, 'path', e.target.value)} 
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#056BFD] outline-none font-mono text-slate-600" 
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ui' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6 animate-fade-in">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Üst Duyuru Çubuğu (Top Announcement)</h2>
            <p className="text-sm text-slate-500 mt-1">Sitenin en üstünde yer alan renkli kampanya duyurusu.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 p-5 border border-slate-100 rounded-xl bg-slate-50">
            <div className="flex items-center justify-between col-span-2 mb-2">
              <h3 className="font-bold text-slate-800">Görünürlük</h3>
              <button
                onClick={() => updateUiElement('topAnnouncement', 'visible', !uiElements.topAnnouncement.visible)}
                className={`w-12 h-7 rounded-full transition-colors relative ${uiElements.topAnnouncement.visible ? 'bg-[#056BFD]' : 'bg-slate-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${uiElements.topAnnouncement.visible ? 'translate-x-6' : 'translate-x-1'}`}></div>
              </button>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Duyuru Metni</label>
              <input value={uiElements.topAnnouncement.text} onChange={e => updateUiElement('topAnnouncement', 'text', e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#056BFD] outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Buton Metni</label>
              <input value={uiElements.topAnnouncement.linkText} onChange={e => updateUiElement('topAnnouncement', 'linkText', e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#056BFD] outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Buton Linki</label>
              <input value={uiElements.topAnnouncement.linkPath} onChange={e => updateUiElement('topAnnouncement', 'linkPath', e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#056BFD] outline-none font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Arka Plan Rengi</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={uiElements.topAnnouncement.bgColor} onChange={e => updateUiElement('topAnnouncement', 'bgColor', e.target.value)} className="w-10 h-10 rounded border-0 cursor-pointer" />
                <input value={uiElements.topAnnouncement.bgColor} onChange={e => updateUiElement('topAnnouncement', 'bgColor', e.target.value)} className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#056BFD] outline-none font-mono" />
              </div>
            </div>
          </div>

          <hr className="border-slate-100 my-6" />

          <div>
            <h2 className="text-lg font-bold text-slate-800">Sol Sabit Promosyon Butonu</h2>
            <p className="text-sm text-slate-500 mt-1">Sitenin sol tarafına yapışık duran dikey kampanya butonu.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 p-5 border border-slate-100 rounded-xl bg-slate-50">
             <div className="flex items-center justify-between col-span-2 mb-2">
              <h3 className="font-bold text-slate-800">Görünürlük</h3>
              <button
                onClick={() => updateUiElement('leftStickyPromo', 'visible', !uiElements.leftStickyPromo.visible)}
                className={`w-12 h-7 rounded-full transition-colors relative ${uiElements.leftStickyPromo.visible ? 'bg-[#056BFD]' : 'bg-slate-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${uiElements.leftStickyPromo.visible ? 'translate-x-6' : 'translate-x-1'}`}></div>
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Duyuru Metni</label>
              <input value={uiElements.leftStickyPromo.text} onChange={e => updateUiElement('leftStickyPromo', 'text', e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#056BFD] outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Yönlendirme Linki</label>
              <input value={uiElements.leftStickyPromo.path} onChange={e => updateUiElement('leftStickyPromo', 'path', e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#056BFD] outline-none font-mono" />
            </div>
          </div>

          <hr className="border-slate-100 my-6" />

          <div>
            <h2 className="text-lg font-bold text-slate-800">Sağ Sabit Butonlar (Başa Dön & Arayın)</h2>
            <p className="text-sm text-slate-500 mt-1">Sitenin sağ tarafına yapışık duran asistan ve geri dönüş butonları.</p>
          </div>
          
          <div className="p-5 border border-slate-100 rounded-xl bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Görünürlük</h3>
            <button
              onClick={() => updateUiElement('rightStickyButtons', 'visible', !uiElements.rightStickyButtons.visible)}
              className={`w-12 h-7 rounded-full transition-colors relative ${uiElements.rightStickyButtons.visible ? 'bg-[#056BFD]' : 'bg-slate-200'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${uiElements.rightStickyButtons.visible ? 'translate-x-6' : 'translate-x-1'}`}></div>
            </button>
          </div>

          <hr className="border-slate-100 my-6" />

          <div>
            <h2 className="text-lg font-bold text-slate-800">WhatsApp Butonu</h2>
            <p className="text-sm text-slate-500 mt-1">Sağ altta yer alan WhatsApp hızlı iletişim butonu.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 p-5 border border-slate-100 rounded-xl bg-slate-50">
             <div className="flex items-center justify-between col-span-2 mb-2">
              <h3 className="font-bold text-slate-800">Görünürlük</h3>
              <button
                onClick={() => updateUiElement('whatsapp', 'visible', !uiElements.whatsapp.visible)}
                className={`w-12 h-7 rounded-full transition-colors relative ${uiElements.whatsapp.visible ? 'bg-[#056BFD]' : 'bg-slate-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${uiElements.whatsapp.visible ? 'translate-x-6' : 'translate-x-1'}`}></div>
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Telefon Numarası (Uluslararası format)</label>
              <input value={uiElements.whatsapp.number} onChange={e => updateUiElement('whatsapp', 'number', e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#056BFD] outline-none" placeholder="Örn: 905321234567" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Hazır Mesaj (Opsiyonel)</label>
              <input value={uiElements.whatsapp.message} onChange={e => updateUiElement('whatsapp', 'message', e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#056BFD] outline-none" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'offices' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Satış Ofisleri Yönetimi</h2>
              <p className="text-sm text-slate-500 mt-1">Sitenin üst menüsünde görünecek satış ofislerini buradan ekleyebilir ve düzenleyebilirsiniz.</p>
            </div>
            <button
              onClick={() => addSalesOffice({ name: 'Yeni Ofis', address: '', phone: '', mapUrl: '' })}
              className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-emerald-600 transition-colors flex items-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Yeni Ofis Ekle
            </button>
          </div>
          
          <div className="space-y-4">
            {salesOffices.map((office) => (
              <div key={office.id} className="p-5 border border-slate-200 rounded-xl bg-slate-50 relative group">
                <button 
                  onClick={() => deleteSalesOffice(office.id)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
                
                <div className="grid md:grid-cols-2 gap-4 pr-10">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Ofis Adı</label>
                    <input value={office.name} onChange={e => updateSalesOffice(office.id, { name: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#056BFD] outline-none font-bold text-slate-800" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Telefon</label>
                    <input value={office.phone} onChange={e => updateSalesOffice(office.id, { phone: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#056BFD] outline-none" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Adres</label>
                    <input value={office.address} onChange={e => updateSalesOffice(office.id, { address: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#056BFD] outline-none" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Google Maps Harita Linki (İsteğe Bağlı)</label>
                    <input value={office.mapUrl} onChange={e => updateSalesOffice(office.id, { mapUrl: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#056BFD] outline-none font-mono text-slate-500" placeholder="https://maps.google.com/..." />
                  </div>
                </div>
              </div>
            ))}
            
            {salesOffices.length === 0 && (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <span className="material-symbols-outlined text-slate-300 text-4xl mb-2">store_off</span>
                <p className="text-slate-500 font-medium">Henüz bir satış ofisi eklenmemiş.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Bildirim Tercihleri</h2>
          {[
            { key: 'emailNotifications', label: 'E-posta Bildirimleri', desc: 'Yeni rezervasyon ve ödeme bildirimlerini e-posta ile alın' },
            { key: 'smsNotifications', label: 'SMS Bildirimleri', desc: 'Acil durum ve iptal bildirimlerini SMS ile alın' },
            { key: 'autoConfirm', label: 'Otomatik Onay', desc: 'Yeni rezervasyonları otomatik olarak onaylayın' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-5 border border-slate-100 rounded-xl hover:shadow-sm transition-all">
              <div>
                <h3 className="font-bold text-slate-800">{item.label}</h3>
                <p className="text-sm text-slate-500 mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() => setSettings({...settings, [item.key]: !settings[item.key]})}
                className={`w-12 h-7 rounded-full transition-colors relative ${settings[item.key] ? 'bg-[#056BFD]' : 'bg-slate-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${settings[item.key] ? 'translate-x-6' : 'translate-x-1'}`}></div>
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
          <div className="flex items-center gap-6 mb-6">
            <img src={user?.avatar} alt="Admin" className="w-20 h-20 rounded-full border-4 border-white shadow-lg" />
            <div>
              <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
              <p className="text-slate-500">{user?.email}</p>
              <span className="text-xs font-bold text-[#056BFD] bg-blue-50 px-2 py-1 rounded-lg mt-1 inline-block uppercase">{user?.role}</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Ad Soyad</label>
              <input defaultValue={user?.name} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#056BFD] outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">E-posta</label>
              <input defaultValue={user?.email} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#056BFD] outline-none" />
            </div>
          </div>
          <hr className="border-slate-100" />
          <h3 className="text-lg font-bold text-slate-800">Şifre Değiştir</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Mevcut Şifre</label>
              <input type="password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#056BFD] outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Yeni Şifre</label>
              <input type="password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#056BFD] outline-none" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
