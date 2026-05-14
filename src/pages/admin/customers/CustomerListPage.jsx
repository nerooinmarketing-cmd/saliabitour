import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useData } from '../../../contexts/DataContext';
import { useState } from 'react';

export default function CustomerListPage() {
  const { t } = useLanguage();
  const { customers } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = (customers || []).filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t('admin.customers.title')}</h1>
          <p className="text-slate-500 mt-1">{t('admin.customers.subtitle')}</p>
        </div>
        <button className="bg-[#056BFD] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#0054cb] transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          {t('admin.customers.addCustomer')}
        </button>
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
                <th className="px-6 py-4">{t('admin.customers.customerName')}</th>
                <th className="px-6 py-4">{t('admin.customers.phone')}</th>
                <th className="px-6 py-4">{t('admin.customers.totalReservations')}</th>
                <th className="px-6 py-4">{t('admin.customers.lastReservation')}</th>
                <th className="px-6 py-4 text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(customer => (
                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#dae2ff] text-[#001847] flex items-center justify-center font-bold">
                        {customer.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{customer.name}</div>
                        <div className="text-xs text-slate-500">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{customer.phone}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{customer.totalReservations}</div>
                    <div className="text-xs text-slate-400">₺{customer.totalSpent?.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">{customer.lastReservation}</td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/admin/customers/${customer.id}`} className="p-1.5 text-slate-400 hover:text-[#056BFD] hover:bg-blue-50 rounded-lg transition-colors inline-flex" title={t('common.details')}>
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
