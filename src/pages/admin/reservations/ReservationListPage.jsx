import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useData } from '../../../contexts/DataContext';
import { useState } from 'react';

export default function ReservationListPage() {
  const { t } = useLanguage();
  const { reservations } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = (reservations || []).filter(r => 
    r.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">{t('admin.reservations.title')}</h1>
        <p className="text-slate-500 mt-1">{t('admin.reservations.subtitle')}</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input 
              type="text" 
              placeholder={t('common.search') + "..."}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#056BFD] focus:ring-1 focus:ring-[#056BFD]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">{t('admin.reservations.reservationId')}</th>
                <th className="px-6 py-4">{t('admin.reservations.customer')}</th>
                <th className="px-6 py-4">{t('admin.reservations.tourHotel')}</th>
                <th className="px-6 py-4">{t('admin.reservations.checkInDate')}</th>
                <th className="px-6 py-4">{t('admin.reservations.totalAmount')}</th>
                <th className="px-6 py-4">{t('common.status')}</th>
                <th className="px-6 py-4 text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(res => (
                <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{res.id}</td>
                  <td className="px-6 py-4 font-medium">{res.customerName}</td>
                  <td className="px-6 py-4">
                    <div className="text-slate-800">{res.itemName}</div>
                    <div className="text-xs text-slate-400 uppercase">{res.type}</div>
                  </td>
                  <td className="px-6 py-4">{res.date}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">₺{res.amount?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      res.status === 'confirmed' ? 'bg-green-50 text-green-600' : 
                      res.status === 'completed' ? 'bg-blue-50 text-[#056BFD]' :
                      res.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {t(`admin.reservations.status${res.status?.charAt(0).toUpperCase() + res.status?.slice(1)}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/admin/reservations/${res.id}`} className="p-1.5 text-slate-400 hover:text-[#056BFD] hover:bg-blue-50 rounded-lg transition-colors inline-flex" title={t('common.details')}>
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </Link>
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
