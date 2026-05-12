import React, { useState } from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Url_backend } from '../App';

const ReservationForm = ({ token }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [time, setTime] = useState("9:00 AM - 10:00 AM");  
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("1");

  const HandleSubmit = async (e) => {
    e.preventDefault();
    try {
       if (!name || !email || !phone || !time || !date || !guests) {
        toast.error("Please fill in all fields");
        return;
      }

       const reservationData = {
        name: name,
        email: email,
        phone: phone,
        time: time,
        date: date,
        guests: guests,
      };

      const response = await axios.post(
        `${Url_backend}/api/reservation/add`,
        reservationData,  
        {
          headers: {
            token: token,  
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Reservation successful!");
        
         setName("");
        setEmail("");
        setPhone("");
        setTime("9:00 AM - 10:00 AM");
        setDate("");
        setGuests("1");
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Submission Error:", err.response?.data);
      toast.error(
        err.response?.data?.message || "Error making reservation. Please try again."
      );
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 21; hour++) {
      const startHour = hour % 12 === 0 ? 12 : hour % 12;
      const startPeriod = hour < 12 ? "AM" : "PM";
      const endHour = (hour + 1) % 12 === 0 ? 12 : (hour + 1) % 12;
      const endPeriod = (hour + 1) < 12 ? "AM" : "PM";
      const timeSlot = `${startHour}:00 ${startPeriod} - ${endHour}:00 ${endPeriod}`;
      slots.push(timeSlot);
    }
    return slots;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* LEFT SIDE: Reservation Form */}
        <div className="lg:col-span-3 p-8 sm:p-12">
          <div className="mb-10">
            <h2 className="text-emerald-600 font-bold tracking-widest uppercase text-sm">Reserve a Table</h2>
            <h1 className="text-4xl font-extrabold text-gray-900 mt-2">
              Dine With Us <span className="text-emerald-600">.</span>
            </h1>
          </div>

          <form onSubmit={HandleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-group">
                <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                <input 
                  name='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text" 
                  placeholder="John Doe" 
                  required 
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="form-group">
                <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                <input 
                  name='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email" 
                  placeholder="john@example.com" 
                  required 
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-group">
                <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                <input 
                  name='phone'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel" 
                  placeholder="+855 ..." 
                  required 
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="form-group">
                <label className="block text-gray-700 font-semibold mb-2">Reservation Date</label>
                <input 
                  name='date'
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  type="date" 
                  required 
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-group">
                <label className="block text-gray-700 font-semibold mb-2">Select Time</label>
                <select 
                  name='time'
                  value={time}
                  onChange={(e) => setTime(e.target.value)} 
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                >
                  {generateTimeSlots().map((slot, index) => (
                    <option key={index} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="block text-gray-700 font-semibold mb-2">Guests</label>
                <select 
                  name='guests'
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)} 
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} Person{i + 1 > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]"
            >
              Confirm Booking
            </button>
          </form>
        </div>

        
        <div className="lg:col-span-2 bg-emerald-600 p-8 sm:p-12 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            <div className="space-y-8">
              <div>
                <h4 className="text-emerald-200 text-xs uppercase tracking-widest font-bold mb-2">Our Location</h4>
                <p className="text-lg">Emerald Bistro</p>
                <p className="opacity-90">#123 Street 128, Phnom Penh, Cambodia</p>
              </div>
              <div>
                <h4 className="text-emerald-200 text-xs uppercase tracking-widest font-bold mb-2">Opening Hours</h4>
                <div className="space-y-1 opacity-90">
                  <p>Mon - Fri: 11:00 AM - 10:00 PM</p>
                  <p>Sat - Sun: 10:00 AM - 11:00 PM</p>
                </div>
              </div>
              <div>
                <h4 className="text-emerald-200 text-xs uppercase tracking-widest font-bold mb-2">Quick Contact</h4>
                <p className="text-lg">+855 12 345 678</p>
                <p className="opacity-90 text-sm">support@emeraldbistro.com</p>
              </div>
            </div>
          </div>
          <div className="mt-12 lg:mt-0">
            <h4 className="text-emerald-200 text-xs uppercase tracking-widest font-bold mb-4">Follow Our Journey</h4>
            <div className="flex gap-5 text-2xl">
              <FaFacebook className="hover:text-emerald-200 cursor-pointer transition-colors" />
              <FaTwitter className="hover:text-emerald-200 cursor-pointer transition-colors" />
              <FaInstagram className="hover:text-emerald-200 cursor-pointer transition-colors" />
              <FaYoutube className="hover:text-emerald-200 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;