import React from 'react'
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white">
       <div className="bg-emerald-600 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Need Update On Latest Offers?</h1>
            <p className="text-emerald-100 mt-2">Subscribe to our newsletter to get frequent updates.</p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder='Enter your email address' 
              className="px-6 py-3 rounded-full w-full md:w-80 outline-none focus:ring-2 focus:ring-emerald-400 text-gray-800"
            />
            <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-black transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

       <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          
           <div className="space-y-6">
            <h1 className="text-2xl font-bold text-emerald-700 italic">Emerald Bistro</h1>
            <p className="text-gray-500 max-w-sm">
              Bringing the freshest ingredients to your table since 2024. Experience the art of fine dining with a touch of nature.
            </p>
            <div className="flex gap-5 text-2xl text-gray-400">
              <FaFacebook className="hover:text-emerald-600 cursor-pointer transition-all hover:-translate-y-1" />
              <FaTwitter className="hover:text-emerald-600 cursor-pointer transition-all hover:-translate-y-1" />
              <FaInstagram className="hover:text-emerald-600 cursor-pointer transition-all hover:-translate-y-1" />
              <FaYoutube className="hover:text-emerald-600 cursor-pointer transition-all hover:-translate-y-1" />
            </div>
          </div>

           <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Navigation</h4>
              <ul className="space-y-4 text-gray-600">
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Menu</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">About Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Legal</h4>
              <ul className="space-y-4 text-gray-600">
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Contact</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                123 Bistro Lane<br/>
                Phnom Penh, CP 12000<br/>
                +855 12 345 678
              </p>
            </div>
          </div>
        </div>

      
        <div className="border-t border-gray-100 mt-16 pt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Emerald Bistro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer