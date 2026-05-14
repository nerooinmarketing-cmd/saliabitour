import { useState, useRef } from 'react';

const SAMPLE_MEDIA = [
  { id: '1', name: 'hotel-belek-1.jpg', type: 'image', size: '2.4 MB', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop', uploaded: '2024-04-15' },
  { id: '2', name: 'tour-kapadokya.jpg', type: 'image', size: '1.8 MB', url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=300&fit=crop', uploaded: '2024-04-10' },
  { id: '3', name: 'beach-resort.jpg', type: 'image', size: '3.1 MB', url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=300&fit=crop', uploaded: '2024-03-20' },
  { id: '4', name: 'spa-wellness.jpg', type: 'image', size: '1.2 MB', url: 'https://images.unsplash.com/photo-1544161515-4ae6b918abd8?w=400&h=300&fit=crop', uploaded: '2024-03-15' },
  { id: '5', name: 'istanbul-view.jpg', type: 'image', size: '2.7 MB', url: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=300&fit=crop', uploaded: '2024-02-28' },
  { id: '6', name: 'pool-area.jpg', type: 'image', size: '1.9 MB', url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400&h=300&fit=crop', uploaded: '2024-02-15' },
];

export default function MediaPage() {
  const [media, setMedia] = useState(SAMPLE_MEDIA);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedItems, setSelectedItems] = useState([]);
  const fileInputRef = useRef(null);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newMedia = files.map((file, idx) => ({
      id: String(Date.now() + idx),
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      url: URL.createObjectURL(file),
      uploaded: new Date().toISOString().split('T')[0],
    }));
    setMedia(prev => [...newMedia, ...prev]);
  };

  const handleDelete = () => {
    if (selectedItems.length === 0) return;
    if (confirm(`${selectedItems.length} dosyayı silmek istediğinize emin misiniz?`)) {
      setMedia(prev => prev.filter(m => !selectedItems.includes(m.id)));
      setSelectedItems([]);
    }
  };

  const toggleSelect = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Medya Kütüphanesi</h1>
          <p className="text-slate-500 mt-1">{media.length} dosya yüklendi</p>
        </div>
        <div className="flex gap-3">
          {selectedItems.length > 0 && (
            <button onClick={handleDelete} className="bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-red-600 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">delete</span>
              {selectedItems.length} Dosyayı Sil
            </button>
          )}
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#056BFD]' : 'text-slate-400'}`}>
              <span className="material-symbols-outlined text-lg">grid_view</span>
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-[#056BFD]' : 'text-slate-400'}`}>
              <span className="material-symbols-outlined text-lg">view_list</span>
            </button>
          </div>
          <label className="bg-[#056BFD] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#0054cb] transition-colors flex items-center gap-2 cursor-pointer">
            <span className="material-symbols-outlined text-sm">upload</span>
            Dosya Yükle
            <input ref={fileInputRef} type="file" className="hidden" multiple accept="image/*" onChange={handleUpload} />
          </label>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map(item => (
            <div 
              key={item.id} 
              onClick={() => toggleSelect(item.id)}
              className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all group ${selectedItems.includes(item.id) ? 'border-[#056BFD] ring-2 ring-blue-100' : 'border-transparent hover:border-slate-200'}`}
            >
              <div className="aspect-square bg-slate-100">
                <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="absolute top-2 left-2">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedItems.includes(item.id) ? 'bg-[#056BFD] border-[#056BFD]' : 'border-white bg-black/20'}`}>
                  {selectedItems.includes(item.id) && <span className="material-symbols-outlined text-white text-sm">check</span>}
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <p className="text-white text-xs font-bold truncate">{item.name}</p>
                <p className="text-white/60 text-[10px]">{item.size}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 w-12"></th>
                <th className="px-6 py-4">Dosya</th>
                <th className="px-6 py-4">Boyut</th>
                <th className="px-6 py-4">Yükleme Tarihi</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {media.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3">
                    <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => toggleSelect(item.id)} className="w-4 h-4 rounded text-[#056BFD]" />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <img src={item.url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-bold text-slate-800">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">{item.size}</td>
                  <td className="px-6 py-3">{item.uploaded}</td>
                  <td className="px-6 py-3 text-right">
                    <button onClick={() => { setSelectedItems([item.id]); handleDelete(); }} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
