import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Url_backend } from '../App';
import { MdTableRestaurant, MdDelete } from 'react-icons/md';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Cancelled'];

const statusStyle = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-red-100 text-red-600',
};

const AdminTable = ({ token }) => {
  const [reservation, setReservation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMap, setStatusMap] = useState({});

  const fetchReservations = async () => {
    try {
      const response = await axios.get(`${Url_backend}/api/reservation/get`, {
        headers: { token },
      });
      const data = Array.isArray(response.data) ? response.data : [];
      setReservation(data);

      // Load persisted statuses from localStorage
      const saved = JSON.parse(localStorage.getItem('reservationStatuses') || '{}');
      const initial = {};
      data.forEach(item => {
        initial[item._id] = saved[item._id] || 'Pending';
      });
      setStatusMap(initial);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching reservations');
    } finally {
      setLoading(false);
    }
  };

  const deleteReservation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reservation?')) return;
    try {
      await axios.delete(`${Url_backend}/api/reservation/remove/${id}`, {
        headers: { token },
      });
      toast.success('Reservation removed successfully');
      await fetchReservations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error removing reservation');
    }
  };

  const updateStatus = (id, newStatus) => {
    const updated = { ...statusMap, [id]: newStatus };
    setStatusMap(updated);
    localStorage.setItem('reservationStatuses', JSON.stringify(updated));
    toast.success(`Status updated to ${newStatus}`);
  };

  useEffect(() => { fetchReservations(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="py-6 px-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Reservations</h1>
        <p className="text-sm text-gray-500 mt-1">{reservation.length} total booking{reservation.length !== 1 ? 's' : ''}</p>
      </div>

      {reservation.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 text-gray-400">
          <MdTableRestaurant className="text-6xl mb-4" />
          <p className="text-lg font-medium">No reservations yet</p>
          <p className="text-sm">Bookings made by customers will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-100">
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Customer</th>
                  <th className="py-3 px-4 text-left">Phone</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Time</th>
                  <th className="py-3 px-4 text-left">Guests</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reservation.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-400">{index + 1}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{item.name}</td>
                    <td className="py-3 px-4 text-gray-600">{item.phone}</td>
                    <td className="py-3 px-4 text-gray-600">{item.email}</td>
                    <td className="py-3 px-4 text-gray-600">{item.date}</td>
                    <td className="py-3 px-4 text-gray-600">{item.time}</td>
                    <td className="py-3 px-4">
                      <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full">
                        {item.guests} {Number(item.guests) > 1 ? 'guests' : 'guest'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={statusMap[item._id] || 'Pending'}
                        onChange={(e) => updateStatus(item._id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 outline-none cursor-pointer ${statusStyle[statusMap[item._id] || 'Pending']}`}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => deleteReservation(item._id)}
                        className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <MdDelete className="text-base" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTable;
