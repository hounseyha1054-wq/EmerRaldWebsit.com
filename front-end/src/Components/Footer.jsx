import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa';
import { MdLocationOn, MdPhone, MdEmail } from 'react-icons/md';

const Footer = () => {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="bg-zinc-900 border-t border-zinc-800">
      {/* Newsletter */}
      <div className="bg-emerald-700 py-14 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-emerald-200 text-xs tracking-[5px] font-semibold mb-2">STAY IN THE LOOP</p>
            <h3 className="text-2xl md:text-3xl font-serif text-white">Get the Latest Offers</h3>
            <p className="text-emerald-100/70 text-sm mt-2">Subscribe for exclusive deals and seasonal menus.</p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="px-6 py-3.5 rounded-full w-full md:w-80 outline-none bg-white/10 border border-white/20 text-white placeholder-emerald-200/50 focus:bg-white/15 focus:border-white/40 transition-all text-sm"
            />
            <button
              type="submit"
              className="bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold tracking-widest px-8 py-3.5 rounded-full transition-all duration-300 whitespace-nowrap"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="md:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">E</div>
              <div>
                <h1 className="text-xl font-serif text-white tracking-wider">EMERALD</h1>
                <p className="text-[9px] text-emerald-400 tracking-[3px] -mt-0.5">BISTRO</p>
              </div>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Fine dining in the heart of Phnom Penh since 2024. A celebration of flavour, craftsmanship, and culture.
            </p>
            <div className="flex gap-3">
              {[FaFacebook, FaTwitter, FaInstagram, FaYoutube].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-emerald-600 border border-zinc-700 hover:border-emerald-600 flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Icon className="text-sm" />
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-[3px] uppercase mb-6">Navigation</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', id: 'home' },
                { label: 'Menu', id: 'menu' },
                { label: 'Reservations', id: 'reservations' },
                { label: 'Contact', id: 'contact' },
              ].map(({ label, id }) => (
                <li key={id}>
                  <button
                    onClick={() => scrollTo(id)}
                    className="text-zinc-500 hover:text-emerald-400 transition-colors text-sm"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-[3px] uppercase mb-6">Legal</h4>
            <ul className="space-y-3 text-zinc-500 text-sm">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-emerald-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-[3px] uppercase mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-zinc-500">
                <MdLocationOn className="text-emerald-500 text-base mt-0.5 flex-shrink-0" />
                <span>#123 Street 128, Phnom Penh, Cambodia</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-500">
                <MdPhone className="text-emerald-500 text-base flex-shrink-0" />
                <span>+855 12 345 678</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-500">
                <MdEmail className="text-emerald-500 text-base flex-shrink-0" />
                <span>support@emeraldbistro.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-800 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-600 text-xs">
          <p>© {new Date().getFullYear()} Emerald Bistro. All rights reserved.</p>
          <p className="tracking-wider">PHNOM PENH • CAMBODIA</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
