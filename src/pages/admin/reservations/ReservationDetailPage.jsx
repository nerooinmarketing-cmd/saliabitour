import { useParams, Link } from 'react-router-dom';
import { reservations } from '../../../data/reservations';
import { useState } from 'react';

export default function ReservationDetailPage() {
  const { id } = useParams();
  const reservation = reservations.find(r => r.id === id);
  const [status, setStatus] = useState(reservation?.status || 'pending');

  if (!reservation) return (
    <div className="text-center py-20">
      <span className="material-symbols-outlined text-5xl text-slate-200 mb-4">search_off</span>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Rezervasyon Bulunamadı</h2>
      <Link to="/admin/reservations" className="text-[#056BFD] font-bold text-sm hover:underline">Listeye Dön</Link>
    </div>
  );

  const statusLabels = { pending: 'Beklemede', confirmed: 'Onaylandı', paid: 'Ödendi', cancelled: 'İptal', completed: 'Tamamlandı' };
  const statusColors = { pending: 'bg-orange-50 text-orange-600', confirmed: 'bg-green-50 text-green-600', paid: 'bg-blue-50 text-[#056BFD]', cancelled: 'bg-red-50 text-red-600', completed: 'bg-slate-100 text-slate-600' };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link to="/admin/reservations" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <span className="material-symbols-outlined text-slate-500">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Rezervasyon #{reservation.id}</h1>
          <p className="text-slate-500 mt-0.5">Rezervasyon detay ve yönetim sayfası</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#056BFD]">info</span>
              Rezervasyon Bilgileri
            </h2>
            <div className="grid md:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Müşteri</p>
                <p className="text-sm font-bold text-slate-800">{reservation.customerName}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Tur / Otel</p>
                <p className="text-sm font-bold text-slate-800">{reservation.itemName}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Tip</p>
                <p className="text-sm text-slate-800 uppercase">{reservation.type}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Misafir Sayısı</p>
                <p className="text-sm text-slate-800">{reservation.guests} Kişi</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Giriş Tarihi</p>
                <p className="text-sm text-slate-800">{reservation.date}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Çıkış Tarihi</p>
                <p className="text-sm text-slate-800">{reservation.endDate}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#056BFD]">sticky_note_2</span>
              Notlar
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Müşteri Notu</p>
                <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl">{reservation.notes || 'Not belirtilmemiş'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Admin Notu</p>
                <textarea defaultValue={reservation.adminNotes} rows="3" className="w-full text-sm p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#056BFD] outline-none resize-none" placeholder="Admin notu ekleyin..." />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Ödeme Özeti</h3>
            <div className="text-3xl font-black text-[#056BFD] mb-4">₺{reservation.amount.toLocaleString()}</div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Ödeme Durumu</span>
                <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${reservation.paymentStatus === 'paid' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                  {reservation.paymentStatus === 'paid' ? 'Ödendi' : reservation.paymentStatus === 'partial' ? 'Kısmi' : 'Ödenmedi'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Para Birimi</span>
                <span className="font-bold">{reservation.currency}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Durum Yönetimi</h3>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#056BFD] outline-none appearance-none mb-4"
            >
              {Object.entries(statusLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${statusColors[status]}`}>
              <div className="w-2 h-2 rounded-full bg-current"></div>
              {statusLabels[status]}
            </span>
          </div>

          <button className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">cancel</span>
            Rezervasyonu İptal Et
          </button>
        </div>
      </div>
    </div>
  );
}
