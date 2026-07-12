import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Url_backend } from '../App';
import { toast } from 'react-toastify';
import {
  MdCalendarToday,
  MdPeople,
  MdCheckCircle,
  MdCancel,
  MdHourglassEmpty,
  MdPrint,
  MdFileDownload,
  MdChevronLeft,
  MdChevronRight,
} from 'react-icons/md';

/* ── helpers ─────────────────────────────────────────── */
const fmt = (d) => d.toISOString().split('T')[0];           // YYYY-MM-DD
const display = (iso) => {                                   // "June 18, 2026"
  const [y, m, d] = iso.split('-');
  return new Date(+y, +m - 1, +d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
};

const STATUS_STYLE = {
  Confirmed: 'bg-emerald-100 text-emerald-700',
  Pending:   'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-600',
};

/* ── component ───────────────────────────────────────── */
const ReportPage = ({ token }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(fmt(new Date()));
  const printRef = useRef(null);

  /* fetch all reservations once */
  const fetchReservations = async () => {
    try {
      const res = await axios.get(`${Url_backend}/api/reservation/get`, {
        headers: { token },
      });
      setReservations(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReservations(); }, []);

  /* read statuses from localStorage (same source as AdminTable) */
  const statusMap = JSON.parse(localStorage.getItem('reservationStatuses') || '{}');
  const getStatus = (id) => statusMap[id] || 'Pending';

  /* filter to selected date */
  const dayReservations = reservations.filter((r) => r.date === selectedDate);
  const confirmed  = dayReservations.filter((r) => getStatus(r._id) === 'Confirmed');
  const pending    = dayReservations.filter((r) => getStatus(r._id) === 'Pending');
  const cancelled  = dayReservations.filter((r) => getStatus(r._id) === 'Cancelled');
  const totalGuests = confirmed.reduce((s, r) => s + Number(r.guests), 0);

  /* date navigation */
  const changeDay = (delta) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    setSelectedDate(fmt(d));
  };

  /* print */
  const handlePrint = () => window.print();

  /* export CSV */
  const handleCSV = () => {
    const header = '#,Name,Email,Phone,Time,Guests,Status';
    const rows = dayReservations.map((r, i) =>
      [
        i + 1,
        `"${r.name}"`,
        `"${r.email}"`,
        `"${r.phone}"`,
        `"${r.time}"`,
        r.guests,
        getStatus(r._id),
      ].join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${selectedDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  const isToday = selectedDate === fmt(new Date());

  return (
    <div className="py-6 px-6 space-y-6">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daily Report</h1>
          <p className="text-sm text-gray-500 mt-0.5">Reservation summary for a specific date</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 no-print">
          <button
            onClick={handleCSV}
            disabled={dayReservations.length === 0}
            className="flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <MdFileDownload className="text-base" />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            disabled={dayReservations.length === 0}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <MdPrint className="text-base" />
            Print Report
          </button>
        </div>
      </div>

      {/* ── Date selector ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 no-print">
        {/* Prev / Next */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => changeDay(-1)}
            className="w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <MdChevronLeft className="text-xl text-gray-500" />
          </button>

          <div className="flex items-center gap-2 text-gray-800">
            <MdCalendarToday className="text-emerald-600 text-lg" />
            <span className="font-semibold text-base">{display(selectedDate)}</span>
            {isToday && (
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">TODAY</span>
            )}
          </div>

          <button
            onClick={() => changeDay(1)}
            className="w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <MdChevronRight className="text-xl text-gray-500" />
          </button>
        </div>

        {/* Direct date picker */}
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        {/* Today shortcut */}
        {!isToday && (
          <button
            onClick={() => setSelectedDate(fmt(new Date()))}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Jump to today →
          </button>
        )}
      </div>

      {/* ── Printable area ── */}
      <div ref={printRef} id="print-area">

        {/* Print-only header */}
        <div className="hidden print:block mb-6">
          <h1 className="text-2xl font-bold">Emerald Bistro — Daily Report</h1>
          <p className="text-gray-600">{display(selectedDate)}</p>
          <p className="text-gray-400 text-sm">Generated: {new Date().toLocaleString()}</p>
          <hr className="my-3" />
        </div>

        {/* ── Summary cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Bookings',
              value: dayReservations.length,
              icon: <MdCalendarToday className="text-2xl" />,
              light: 'bg-blue-50', text: 'text-blue-600',
            },
            {
              label: 'Confirmed',
              value: confirmed.length,
              icon: <MdCheckCircle className="text-2xl" />,
              light: 'bg-emerald-50', text: 'text-emerald-600',
            },
            {
              label: 'Pending',
              value: pending.length,
              icon: <MdHourglassEmpty className="text-2xl" />,
              light: 'bg-yellow-50', text: 'text-yellow-600',
            },
            {
              label: 'Total Guests',
              value: totalGuests,
              icon: <MdPeople className="text-2xl" />,
              light: 'bg-purple-50', text: 'text-purple-600',
            },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className={`${s.light} ${s.text} p-3 rounded-xl flex-shrink-0`}>{s.icon}</div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Booking table ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-6">

          {/* Table header row */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">
              Bookings on {display(selectedDate)}
            </h2>
            {dayReservations.length > 0 && (
              <span className="text-xs text-gray-400 font-medium bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
                {dayReservations.length} reservation{dayReservations.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {dayReservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <MdCalendarToday className="text-5xl mb-3" />
              <p className="font-medium text-gray-500">No reservations on this date</p>
              <p className="text-sm mt-1">Try a different date using the selector above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-100">
                    <th className="py-3 px-4 text-left">#</th>
                    <th className="py-3 px-4 text-left">Customer</th>
                    <th className="py-3 px-4 text-left">Email</th>
                    <th className="py-3 px-4 text-left">Phone</th>
                    <th className="py-3 px-4 text-left">Time</th>
                    <th className="py-3 px-4 text-left">Guests</th>
                    <th className="py-3 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {dayReservations.map((item, idx) => {
                    const status = getStatus(item._id);
                    return (
                      <tr
                        key={item._id}
                        className={`transition-colors ${
                          status === 'Confirmed'
                            ? 'hover:bg-emerald-50/40'
                            : status === 'Cancelled'
                            ? 'opacity-50 hover:bg-gray-50'
                            : 'hover:bg-yellow-50/30'
                        }`}
                      >
                        <td className="py-3 px-4 text-gray-400 font-medium">{idx + 1}</td>
                        <td className="py-3 px-4 font-semibold text-gray-800">{item.name}</td>
                        <td className="py-3 px-4 text-gray-500 text-xs">{item.email}</td>
                        <td className="py-3 px-4 text-gray-600">{item.phone}</td>
                        <td className="py-3 px-4 text-gray-600">{item.time}</td>
                        <td className="py-3 px-4">
                          <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full">
                            {item.guests} {Number(item.guests) > 1 ? 'guests' : 'guest'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLE[status] || STATUS_STYLE.Pending}`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* Summary footer */}
                <tfoot>
                  <tr className="bg-gray-50 border-t border-gray-200 font-semibold text-gray-700 text-sm">
                    <td colSpan={5} className="py-3 px-4 text-right">Totals:</td>
                    <td className="py-3 px-4">
                      <span className="text-emerald-700 font-bold">{totalGuests} guests confirmed</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-emerald-600 font-bold">{confirmed.length} confirmed</span>
                      {pending.length > 0 && (
                        <span className="ml-2 text-yellow-600 font-bold">{pending.length} pending</span>
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* ── Status breakdown bar (only when there's data) ── */}
        {dayReservations.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Status Breakdown</h3>

            {/* Bar */}
            <div className="flex rounded-full overflow-hidden h-4 mb-4">
              {confirmed.length > 0 && (
                <div
                  style={{ width: `${(confirmed.length / dayReservations.length) * 100}%` }}
                  className="bg-emerald-500 transition-all duration-500"
                  title={`Confirmed: ${confirmed.length}`}
                />
              )}
              {pending.length > 0 && (
                <div
                  style={{ width: `${(pending.length / dayReservations.length) * 100}%` }}
                  className="bg-yellow-400 transition-all duration-500"
                  title={`Pending: ${pending.length}`}
                />
              )}
              {cancelled.length > 0 && (
                <div
                  style={{ width: `${(cancelled.length / dayReservations.length) * 100}%` }}
                  className="bg-red-400 transition-all duration-500"
                  title={`Cancelled: ${cancelled.length}`}
                />
              )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-6 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                Confirmed — {confirmed.length} ({Math.round((confirmed.length / dayReservations.length) * 100)}%)
              </span>
              <span className="flex items-center gap-1.5 text-yellow-700">
                <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
                Pending — {pending.length} ({Math.round((pending.length / dayReservations.length) * 100)}%)
              </span>
              {cancelled.length > 0 && (
                <span className="flex items-center gap-1.5 text-red-600">
                  <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                  Cancelled — {cancelled.length} ({Math.round((cancelled.length / dayReservations.length) * 100)}%)
                </span>
              )}
            </div>
          </div>
        )}

      </div>{/* /print-area */}
    </div>
  );
};

export default ReportPage;
