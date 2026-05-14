import { useParams, Link } from 'react-router-dom';
import { customers } from '../../../data/customers';
import { reservations } from '../../../data/reservations';

export default function CustomerDetailPage() {
  const { id } = useParams();
  const customer = customers.find(c => c.id === id);
  const customerReservations = reservations.filter(r => r.customerId === id);

  if (!customer) return (
    <div className="text-center py-20">
      <span className="material-symbols-outlined text-5xl text-slate-200 mb-4">person_off</span>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Müşteri Bulunamadı</h2>
      <Link to="/admin/customers" className="text-[#056BFD] font-bold text-sm hover:underline">Listeye Dön</Link>
    </div>
  );

  const statusColors = { confirmed: 'bg-green-50 text-green-600', completed: 'bg-blue-50 text-[#056BFD]', cancelled: 'bg-red-50 text-red-600', pending: 'bg-orange-50 text-orange-600', paid: 'bg-blue-50 text-[#056BFD]' };
  const statusLabels = { confirmed: 'Onaylandı', completed: 'Tamamlandı', cancelled: 'İptal', pending: 'Beklemede', paid: 'Ödendi' };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link to="/admin/customers" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <span className="material-symbols-outlined text-slate-500">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Müşteri Profili</h1>
          <p className="text-slate-500 mt-0.5">{customer.name}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[#dae2ff] text-[#001847] flex items-center justify-center font-black text-3xl mx-auto mb-4">
              {customer.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-slate-800">{customer.name}</h2>
            <p className="text-slate-500 text-sm mt-1">{customer.email}</p>
            <p className="text-slate-500 text-sm">{customer.phone}</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">İstatistikler</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Toplam Rezervasyon</span>
                <span className="text-lg font-black text-slate-800">{customer.totalReservations}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Toplam Harcama</span>
                <span className="text-lg font-black text-[#056BFD]">₺{customer.totalSpent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Son Rezervasyon</span>
                <span className="text-sm font-bold text-slate-800">{customer.lastReservation}</span>
              </div>
            </div>
          </div>

          {customer.notes && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-3">Notlar</h3>
              <p className="text-sm text-slate-600">{customer.notes}</p>
            </div>
          )}
        </div>

        {/* Reservations */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Rezervasyon Geçmişi</h2>
            </div>
            {customerReservations.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <span className="material-symbols-outlined text-3xl mb-2">event_busy</span>
                <p>Henüz rezervasyon kaydı bulunmamaktadır.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="text-xs uppercase bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Hizmet</th>
                      <th className="px-6 py-4">Tarih</th>
                      <th className="px-6 py-4">Tutar</th>
                      <th className="px-6 py-4">Durum</th>
                      <th className="px-6 py-4 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customerReservations.map(res => (
                      <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800">{res.id}</td>
                        <td className="px-6 py-4">
                          <div className="text-slate-800">{res.itemName}</div>
                          <div className="text-xs text-slate-400 uppercase">{res.type}</div>
                        </td>
                        <td className="px-6 py-4">{res.date}</td>
                        <td className="px-6 py-4 font-bold">₺{res.amount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${statusColors[res.status]}`}>
                            {statusLabels[res.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link to={`/admin/reservations/${res.id}`} className="p-1.5 text-slate-400 hover:text-[#056BFD] hover:bg-blue-50 rounded-lg transition-colors inline-flex">
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
