import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getReservations } from '../../services/reservationService';
import { getCustomers } from '../../services/customerService';

export default function DashboardPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeBookings: 0,
    newCustomers: 0,
    pendingRequests: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reservationsData, customersData] = await Promise.all([
          getReservations(),
          getCustomers()
        ]);

        let revenue = 0;
        let active = 0;
        let pending = 0;

        const currentYear = new Date().getFullYear();
        const monthlyRevenue = new Array(12).fill(0);

        reservationsData.forEach(res => {
          const amount = Number(res.totalPrice || res.amount || 0);
          
          if (res.status === 'confirmed' || res.status === 'completed') {
            revenue += amount;
          }
          if (res.status === 'confirmed' || res.status === 'pending') {
            active++;
          }
          if (res.status === 'pending') {
            pending++;
          }

          let resDate;
          if (res.createdAt && res.createdAt.toDate) {
            resDate = res.createdAt.toDate();
          } else if (res.createdAt) {
            resDate = new Date(res.createdAt);
          } else if (res.date) {
            resDate = new Date(res.date);
          } else {
            resDate = new Date();
          }

          if (resDate.getFullYear() === currentYear && (res.status === 'confirmed' || res.status === 'completed')) {
            const month = resDate.getMonth();
            monthlyRevenue[month] += amount;
          }
        });

        setStats({
          totalRevenue: revenue,
          activeBookings: active,
          newCustomers: customersData.length,
          pendingRequests: pending
        });

        const months = ['Oca', 'Sub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Agu', 'Eyl', 'Eki', 'Kas', 'Ara'];
        const newChartData = months.map((month, index) => ({
          name: month,
          total: monthlyRevenue[index]
        }));
        setChartData(newChartData);

        const sortedReservations = [...reservationsData].sort((a, b) => {
          const dateA = new Date(a.createdAt?.toDate ? a.createdAt.toDate() : a.createdAt || a.date || new Date(0));
          const dateB = new Date(b.createdAt?.toDate ? b.createdAt.toDate() : b.createdAt || b.date || new Date(0));
          return dateB - dateA;
        }).slice(0, 5);

        setRecentBookings(sortedReservations);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">{t('admin.dashboard.title')}</h1>
        <p className="text-slate-500 mt-1">{t('admin.dashboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: t('admin.dashboard.totalRevenue'), value: formatCurrency(stats.totalRevenue), icon: 'payments', color: 'bg-[#dae2ff] text-[#001847]' },
          { title: t('admin.dashboard.activeBookings'), value: stats.activeBookings, icon: 'confirmation_number', color: 'bg-[#ffdad6] text-[#410001]' },
          { title: t('admin.dashboard.newCustomers'), value: stats.newCustomers, icon: 'group_add', color: 'bg-[#ffdbc7] text-[#311300]' },
          { title: t('admin.dashboard.pendingRequests'), value: stats.pendingRequests, icon: 'pending_actions', color: 'bg-[#e3e7ff] text-[#0054cb]', isNegative: stats.pendingRequests > 0 }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px]">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              {stat.isNegative !== undefined && (
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.isNegative ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                  {stat.isNegative ? '!' : ''}
                </span>
              )}
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-2xl font-black text-slate-800">
                {loading ? t('common.loading') : stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">{t('admin.dashboard.revenueAnalysis')}</h2>
            <select className="bg-[#f3f2ff] border-none text-sm font-bold text-slate-600 rounded-lg py-2 px-4 focus:ring-0">
              <option>{new Date().getFullYear()}</option>
            </select>
          </div>
          <div className="h-72 w-full">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400">{t('common.loading')}</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#056BFD" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#056BFD" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="total" stroke="#056BFD" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">{t('admin.dashboard.recentBookings')}</h2>
            <Link to="/admin/reservations" className="text-sm font-bold text-[#056BFD] hover:underline">{t('admin.dashboard.viewAll')}</Link>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-slate-400 py-4">{t('common.loading')}</div>
            ) : recentBookings.length === 0 ? (
              <div className="text-center text-slate-400 py-4">{t('common.noResults')}</div>
            ) : (
              recentBookings.map(res => {
                const cName = res.customerName || (res.customerDetails ? `${res.customerDetails.firstName || ''} ${res.customerDetails.lastName || ''}`.trim() : 'Musteri');
                const iName = res.itemName || res.tourName || res.hotelName || 'Rezervasyon';
                const amount = Number(res.totalPrice || res.amount || 0);
                
                return (
                  <div key={res.id} className="flex justify-between items-center pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                        {cName ? cName.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{cName}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[120px]" title={iName}>{iName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-800">{formatCurrency(amount)}</p>
                      <p className={`text-xs font-bold ${res.status === 'confirmed' ? 'text-green-600' : 'text-orange-500'}`}>
                        {res.status === 'confirmed' ? t('admin.dashboard.confirmed') : t('admin.dashboard.pendingStatus')}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
