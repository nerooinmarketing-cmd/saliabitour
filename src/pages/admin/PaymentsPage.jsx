import { useState } from 'react';
import { reservations } from '../../data/reservations';

export default function PaymentsPage() {
  const [filter, setFilter] = useState('all');

  const payments = reservations.map(r => ({
    id: r.id,
    customer: r.customerName,
    item: r.itemName,
    amount: r.amount,
    date: r.date,
    paymentStatus: r.paymentStatus,
    type: r.type,
    method: r.paymentStatus === 'paid' ? 'Kredi Kartı' : r.paymentStatus === 'partial' ? 'Havale' : '-',
  }));

  const filtered = filter === 'all' ? payments : payments.filter(p => p.paymentStatus === filter);

  const totalPaid = payments.filter(p => p.paymentStatus === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => ['unpaid', 'partial'].includes(p.paymentStatus)).reduce((sum, p) => sum + p.amount, 0);
  const totalRefunded = payments.filter(p => p.paymentStatus === 'refunded').reduce((sum, p) => sum + p.amount, 0);

  const statusLabels = { paid: 'Ödendi', unpaid: 'Ödenmedi', partial: 'Kısmi Ödeme', refunded: 'İade Edildi' };
  const statusColors = { paid: 'bg-green-50 text-green-600', unpaid: 'bg-red-50 text-red-600', partial: 'bg-orange-50 text-orange-600', refunded: 'bg-blue-50 text-[#056BFD]' };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Ödeme Yönetimi</h1>
        <p className="text-slate-500 mt-1">Tüm ödemeleri takip edin ve yönetin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <span className="text-sm font-medium text-slate-500">Toplam Tahsilat</span>
          </div>
          <h3 className="text-2xl font-black text-green-600">₺{totalPaid.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <span className="material-symbols-outlined">pending</span>
            </div>
            <span className="text-sm font-medium text-slate-500">Bekleyen Ödeme</span>
          </div>
          <h3 className="text-2xl font-black text-orange-600">₺{totalPending.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#056BFD]">
              <span className="material-symbols-outlined">undo</span>
            </div>
            <span className="text-sm font-medium text-slate-500">İade Edildi</span>
          </div>
          <h3 className="text-2xl font-black text-[#056BFD]">₺{totalRefunded.toLocaleString()}</h3>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'all', label: 'Tümü' },
          { id: 'paid', label: 'Ödendi' },
          { id: 'unpaid', label: 'Ödenmedi' },
          { id: 'partial', label: 'Kısmi' },
          { id: 'refunded', label: 'İade' },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${filter === f.id ? 'bg-[#056BFD] text-white' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
          >{f.label}</button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Rezervasyon</th>
                <th className="px-6 py-4">Müşteri</th>
                <th className="px-6 py-4">Hizmet</th>
                <th className="px-6 py-4">Tarih</th>
                <th className="px-6 py-4">Tutar</th>
                <th className="px-6 py-4">Ödeme Yöntemi</th>
                <th className="px-6 py-4">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{p.id}</td>
                  <td className="px-6 py-4 font-medium">{p.customer}</td>
                  <td className="px-6 py-4">
                    <div className="text-slate-800">{p.item}</div>
                    <div className="text-xs text-slate-400 uppercase">{p.type}</div>
                  </td>
                  <td className="px-6 py-4">{p.date}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">₺{p.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">{p.method}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${statusColors[p.paymentStatus]}`}>
                      {statusLabels[p.paymentStatus]}
                    </span>
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
