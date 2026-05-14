import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { blogPosts, siteContent } from '../../data/content';

export default function ContentPage() {
  const { t, lang } = useLanguage();
  const [posts, setPosts] = useState(blogPosts);
  const [activeTab, setActiveTab] = useState('blog');
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqs, setFaqs] = useState(siteContent.faq);

  const handleDeletePost = (id) => {
    if (confirm('Bu içeriği silmek istediğinize emin misiniz?')) {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setPosts(prev => prev.map(p => p.id === id ? {...p, status: p.status === 'published' ? 'draft' : 'published'} : p));
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">İçerik Yönetimi</h1>
          <p className="text-slate-500 mt-1">Blog yazıları ve site içeriklerini yönetin</p>
        </div>
        <button className="bg-[#056BFD] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#0054cb] transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          Yeni İçerik
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'blog', label: 'Blog Yazıları', icon: 'article' },
          { id: 'faq', label: 'SSS (FAQ)', icon: 'quiz' },
          { id: 'pages', label: 'Sayfa İçerikleri', icon: 'web' },
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

      {activeTab === 'blog' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs uppercase bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Başlık</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Yazar</th>
                  <th className="px-6 py-4">Tarih</th>
                  <th className="px-6 py-4">Durum</th>
                  <th className="px-6 py-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={post.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        <div className="font-bold text-slate-800">{lang === 'tr' ? post.titleTR : post.titleEN}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-[#056BFD] rounded-lg text-xs font-bold uppercase">{post.category}</span>
                    </td>
                    <td className="px-6 py-4">{post.author}</td>
                    <td className="px-6 py-4">{post.date}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${post.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}
                      >
                        <div className={`w-2 h-2 rounded-full ${post.status === 'published' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                        {post.status === 'published' ? 'Yayında' : 'Taslak'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-[#056BFD] hover:bg-blue-50 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button onClick={() => handleDeletePost(post.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'faq' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-100 rounded-xl p-5 hover:shadow-sm transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">{lang === 'tr' ? faq.questionTR : faq.questionEN}</h3>
                  <p className="text-sm text-slate-500">{lang === 'tr' ? faq.answerTR : faq.answerEN}</p>
                </div>
                <button className="p-1.5 text-slate-400 hover:text-[#056BFD] hover:bg-blue-50 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
              </div>
            </div>
          ))}
          <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-bold text-slate-400 hover:text-[#056BFD] hover:border-[#056BFD] transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">add</span>
            Yeni SSS Ekle
          </button>
        </div>
      )}

      {activeTab === 'pages' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          {[
            { title: 'Ana Sayfa Hero Başlığı', value: lang === 'tr' ? siteContent.heroTitle.tr : siteContent.heroTitle.en, icon: 'home' },
            { title: 'Ana Sayfa Alt Başlığı', value: lang === 'tr' ? siteContent.heroSubtitle.tr : siteContent.heroSubtitle.en, icon: 'subtitles' },
            { title: 'Hakkımızda Metni', value: lang === 'tr' ? siteContent.aboutText.tr : siteContent.aboutText.en, icon: 'info' },
            { title: 'Şirket Adı', value: siteContent.companyName, icon: 'business' },
            { title: 'E-posta', value: siteContent.contactEmail, icon: 'mail' },
            { title: 'Telefon', value: siteContent.phone, icon: 'phone' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 border border-slate-100 rounded-xl p-4 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#056BFD]">
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-400 uppercase">{item.title}</div>
                <div className="text-sm font-medium text-slate-800 truncate">{item.value}</div>
              </div>
              <button className="p-1.5 text-slate-400 hover:text-[#056BFD] hover:bg-blue-50 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
