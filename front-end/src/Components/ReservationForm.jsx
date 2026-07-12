import { useState } from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa';
import { MdLocationOn, MdAccessTime, MdPhone, MdEmail } from 'react-icons/md';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Url_backend } from '../App';
import { useAuth } from '../context/AuthContext';
import { useCookies } from '../context/CookieContext';

const ReservationForm = ({ onAuthRequired }) => {
  const { isLoggedIn, token, user } = useAuth();
  const { accepted } = useCookies();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '9:00 AM - 10:00 AM',
    guests: '1',
  });
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 21; hour++) {
      const s = hour % 12 === 0 ? 12 : hour % 12;
      const sp = hour < 12 ? 'AM' : 'PM';
      const e = (hour + 1) % 12 === 0 ? 12 : (hour + 1) % 12;
      const ep = hour + 1 < 12 ? 'AM' : 'PM';
      slots.push(`${s}:00 ${sp} - ${e}:00 ${ep}`);
    }
    return slots;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accepted) { toast.warn('Please accept cookies first.'); return; }
    if (!isLoggedIn) { onAuthRequired(); return; }
    const { name, email, phone, date, time, guests } = form;
    if (!name || !email || !phone || !date) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${Url_backend}/api/reservation/add`,
        { name, email, phone, date, time, guests },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message || 'Reservation confirmed!');
        setForm({ name: '', email: '', phone: '', date: '', time: '9:00 AM - 10:00 AM', guests: '1' });
      } else {
        toast.error(response.data.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error making reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3.5 bg-zinc-800/60 border border-zinc-700 hover:border-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 rounded-xl text-white placeholder-zinc-500 outline-none transition-all duration-200 text-sm';

  const labelClass = 'block text-xs font-bold tracking-widest text-zinc-400 mb-2 uppercase';

  return (
    <section id="reservations" className="bg-zinc-950 py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-emerald-400 text-xs tracking-[6px] font-semibold mb-4">RESERVE YOUR EVENING</p>
          <h2 className="text-5xl md:text-6xl font-serif text-white tracking-tight mb-6">
            Dine With Us
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-emerald-500/60" />
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-emerald-500/60" />
          </div>
        </div>

        {/* Card */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl shadow-black/60">

          {/* Form side */}
          <div className="lg:col-span-3 bg-zinc-900 p-8 sm:p-12 relative">

            {/* Gate overlay — shown when not logged in or cookies not accepted */}
            {(!accepted || !isLoggedIn) && (
              <div className="absolute inset-0 z-10 rounded-tl-3xl rounded-bl-3xl backdrop-blur-sm bg-zinc-900/80 flex flex-col items-center justify-center text-center p-8">
                <div className="text-4xl mb-4">{!accepted ? '🍪' : '🔒'}</div>
                <h4 className="text-white font-serif text-xl mb-2">
                  {!accepted ? 'Cookies Required' : 'Sign In to Book'}
                </h4>
                <p className="text-zinc-400 text-sm mb-6 max-w-xs leading-relaxed">
                  {!accepted
                    ? 'Please accept cookies at the bottom of the page to enable reservations.'
                    : 'You need an account to make a reservation at Emerald Bistro.'}
                </p>
                {accepted && !isLoggedIn && (
                  <button
                    type="button"
                    onClick={onAuthRequired}
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-widest rounded-full transition-all"
                  >
                    SIGN IN / SIGN UP
                  </button>
                )}
              </div>
            )}

            <h3 className="text-2xl font-serif text-white mb-2">Make a Reservation</h3>
            <p className="text-zinc-500 text-sm mb-10">Fill in your details and we'll confirm your table.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    value={form.name}
                    onChange={update('name')}
                    type="text"
                    placeholder="John Doe"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input
                    value={form.email}
                    onChange={update('email')}
                    type="email"
                    placeholder="john@example.com"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input
                    value={form.phone}
                    onChange={update('phone')}
                    type="tel"
                    placeholder="+855 12 345 678"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Date</label>
                  <input
                    value={form.date}
                    onChange={update('date')}
                    type="date"
                    required
                    className={inputClass}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Time Slot</label>
                  <select
                    value={form.time}
                    onChange={update('time')}
                    className={inputClass}
                  >
                    {generateTimeSlots().map((slot, i) => (
                      <option key={i} value={slot} className="bg-zinc-900">
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Number of Guests</label>
                  <select
                    value={form.guests}
                    onChange={update('guests')}
                    className={inputClass}
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1} className="bg-zinc-900">
                        {i + 1} {i === 0 ? 'Person' : 'Persons'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white text-sm font-bold tracking-widest rounded-xl transition-all duration-300 shadow-lg shadow-emerald-950/50 hover:shadow-emerald-600/30 hover:-translate-y-px flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4 31.4" />
                    </svg>
                    CONFIRMING...
                  </>
                ) : (
                  'CONFIRM RESERVATION'
                )}
              </button>
            </form>
          </div>

          {/* Info side */}
          <div
            id="contact"
            className="lg:col-span-2 bg-emerald-700 p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-600/30 pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-emerald-800/40 pointer-events-none" />

            <div className="relative z-10">
              <h3 className="text-2xl font-serif text-white mb-2">Contact & Hours</h3>
              <p className="text-emerald-200/70 text-sm mb-10">We look forward to welcoming you.</p>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                    <MdLocationOn className="text-white text-lg" />
                  </div>
                  <div>
                    <p className="text-emerald-200 text-xs tracking-widest font-bold uppercase mb-1">Location</p>
                    <p className="text-white font-medium">Emerald Bistro</p>
                    <p className="text-emerald-100/80 text-sm">#123 Street 128, Phnom Penh</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                    <MdAccessTime className="text-white text-lg" />
                  </div>
                  <div>
                    <p className="text-emerald-200 text-xs tracking-widest font-bold uppercase mb-1">Opening Hours</p>
                    <p className="text-emerald-100/80 text-sm">Mon – Fri: 11:00 AM – 10:00 PM</p>
                    <p className="text-emerald-100/80 text-sm">Sat – Sun: 10:00 AM – 11:00 PM</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                    <MdPhone className="text-white text-lg" />
                  </div>
                  <div>
                    <p className="text-emerald-200 text-xs tracking-widest font-bold uppercase mb-1">Phone</p>
                    <p className="text-white font-medium">+855 12 345 678</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                    <MdEmail className="text-white text-lg" />
                  </div>
                  <div>
                    <p className="text-emerald-200 text-xs tracking-widest font-bold uppercase mb-1">Email</p>
                    <p className="text-white font-medium text-sm">support@emeraldbistro.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-10">
              <p className="text-emerald-200 text-xs tracking-widest font-bold uppercase mb-4">Follow Our Journey</p>
              <div className="flex gap-4">
                {[FaFacebook, FaTwitter, FaInstagram, FaYoutube].map((Icon, i) => (
                  <button
                    key={i}
                    className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-white flex items-center justify-center text-white hover:text-emerald-700 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Icon className="text-base" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReservationForm;
