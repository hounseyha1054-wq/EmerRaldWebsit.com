import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Url_backend } from '../App';
import { toast } from 'react-toastify';
import { MdRestaurantMenu, MdTableRestaurant, MdToday, MdTrendingUp, MdCheckCircle } from 'react-icons/md';

const STATUS_COLORS = {
  Confirmed: 'bg-emerald-100 text-emerald-700',
  Pending:   'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-600',
};

const Dashboard = ({ token }) => {
  const [menuCount, setMenuCount] = useState(0);
  const [reservations, setReservations] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [menuRes, reservationRes] = await Promise.all([
        axios.get(`${Url_backend}/api/product/list`, { headers: { token } }),
        axios.get(`${Url_backend}/api/reservation/get`, { headers: { token } }),
      ]);

      const menuItems = Array.isArray(menuRes.data) ? menuRes.data : menuRes.data.products || [];
      const reservationItems = Array.isArray(reservationRes.data) ? reservationRes.data : [];

      // Load statuses from localStorage (same source as AdminTable)
      const saved = JSON.parse(localStorage.getItem('reservationStatuses') || '{}');
      const map = {};
      reservationItems.forEach(item => {
        map[item._id] = saved[item._id] || 'Pending';
      });

      setMenuCount(menuItems.length);
      setReservations(reservationItems);
      setStatusMap(map);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const today = new Date().toISOString().split('T')[0];

  // Today's CONFIRMED bookings only
  const todayConfirmed = reservations.filter(
    r => r.date === today && statusMap[r._id] === 'Confirmed'
  );

  // Recent reservations — CONFIRMED only, latest 5
  const recentConfirmed = reservations
    .filter(r => statusMap[r._id] === 'Confirmed')
    .slice(0, 5);

  const stats = [
    {
      label: 'Total Menu Items',
      value: menuCount,
      icon: <MdRestaurantMenu className="text-3xl" />,
      light: 'bg-emerald-50',
      text: 'text-emerald-600',
    },
    {
      label: 'Total Reservations',
      value: reservations.length,
      icon: <MdTrendingUp className="text-3xl" />,
      light: 'bg-blue-50',
      text: 'text-blue-600',
    },
    {
      label: "Today's Confirmed",
      value: todayConfirmed.length,
      icon: <MdToday className="text-3xl" />,
      light: 'bg-orange-50',
      text: 'text-orange-600',
    },
    {
      label: 'Tables Managed',
      value: reservations.length > 0 ? Math.ceil(reservations.length / 3) : 0,
      icon: <MdTableRestaurant className="text-3xl" />,
      light: 'bg-purple-50',
      text: 'text-purple-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="py-6 px-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back! Here's what's happening today —{' '}
          <span className="font-medium text-gray-700">{today}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div className={`${stat.light} ${stat.text} p-3 rounded-xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Confirmed Bookings */}
      <div className={`rounded-2xl p-5 border ${todayConfirmed.length > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center gap-2 mb-4">
          <MdCheckCircle className={`text-xl ${todayConfirmed.length > 0 ? 'text-emerald-600' : 'text-gray-400'}`} />
          <h2 className={`text-lg font-semibold ${todayConfirmed.length > 0 ? 'text-emerald-800' : 'text-gray-500'}`}>
            Today's Confirmed Bookings
            <span className="ml-2 text-sm font-normal">({todayConfirmed.length})</span>
          </h2>
        </div>

        {todayConfirmed.length === 0 ? (
          <div className="flex items-center gap-3 text-gray-400 py-2">
            <span className="text-2xl">📋</span>
            <p className="text-sm">No confirmed bookings for today yet. Confirm reservations from the Reservations page.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {todayConfirmed.map((item) => (
              <div key={item._id} className="bg-white rounded-xl p-4 border border-emerald-100 shadow-sm flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                    CONFIRMED
                  </span>
                </div>
                <p className="text-sm text-gray-500">{item.time} · {item.guests} guest{Number(item.guests) > 1 ? 's' : ''}</p>
                <p className="text-xs text-gray-400">{item.email}</p>
                <p className="text-xs text-gray-400">{item.phone}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Confirmed Reservations */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Confirmed Reservations</h2>
          <span className="text-xs text-gray-400 font-medium bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
            {recentConfirmed.length} confirmed
          </span>
        </div>

        {recentConfirmed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <MdTableRestaurant className="text-5xl mb-3" />
            <p className="font-medium">No confirmed reservations yet</p>
            <p className="text-sm text-center">
              Mark reservations as <span className="font-semibold text-emerald-600">Confirmed</span> on the Reservations page to see them here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <th className="py-3 px-4 text-left rounded-l-lg">Customer</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Time</th>
                  <th className="py-3 px-4 text-left">Guests</th>
                  <th className="py-3 px-4 text-left">Phone</th>
                  <th className="py-3 px-4 text-left rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentConfirmed.map((item) => {
                  const status = statusMap[item._id] || 'Pending';
                  const isToday = item.date === today;
                  return (
                    <tr
                      key={item._id}
                      className={`transition-colors ${isToday ? 'bg-emerald-50/50 hover:bg-emerald-50' : 'hover:bg-gray-50'}`}
                    >
                      <td className="py-3 px-4 font-medium text-gray-800">
                        <div className="flex items-center gap-2">
                          {item.name}
                          {isToday && (
                            <span className="text-[9px] font-bold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                              Today
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{item.date}</td>
                      <td className="py-3 px-4 text-gray-600">{item.time}</td>
                      <td className="py-3 px-4">
                        <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full">
                          {item.guests} {Number(item.guests) > 1 ? 'guests' : 'guest'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{item.phone}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[status] || STATUS_COLORS.Pending}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
