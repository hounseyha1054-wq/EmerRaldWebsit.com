import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useCookies } from '../context/CookieContext';
import CartDrawer from './CartDrawer';

const Navbar = ({ onAuthOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { isLoggedIn, user, logout } = useAuth();
  const { count } = useCart();
  const { accepted } = useCookies();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = ['home', 'menu', 'reservations', 'contact'];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setIsOpen(false);
    setProfileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAuthClick = () => {
    if (!accepted) return;
    onAuthOpen();
  };

  const navLinks = [
    { label: 'HOME', id: 'home' },
    { label: 'MENU', id: 'menu' },
    { label: 'RESERVATIONS', id: 'reservations' },
    { label: 'CONTACT', id: 'contact' },
  ];

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-zinc-950/95 backdrop-blur-md shadow-lg shadow-black/40 border-b border-emerald-900/30'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => scrollTo('home')} className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-900/50 group-hover:bg-emerald-500 transition-colors">
              E
            </div>
            <div>
              <h1 className="text-xl font-serif tracking-wider text-white leading-none">EMERALD</h1>
              <p className="text-[9px] text-emerald-400 tracking-[3px]">BISTRO</p>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10 text-xs font-semibold tracking-widest">
            {navLinks.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`relative transition-colors duration-300 group ${
                  activeSection === id ? 'text-emerald-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                {label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-emerald-500 transition-all duration-300 ${
                    activeSection === id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart button */}
            {isLoggedIn && (
              <button
                onClick={() => setCartOpen(true)}
                className="relative w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white transition-all"
                aria-label="Cart"
              >
                🛒
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </button>
            )}

            {/* Auth */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                  <span className="text-white text-xs font-semibold max-w-[100px] truncate">{user?.name}</span>
                  <span className="text-zinc-500 text-xs">{profileOpen ? '▲' : '▼'}</span>
                </button>

                {profileOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden py-1">
                    <div className="px-4 py-3 border-b border-zinc-800">
                      <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
                      <p className="text-zinc-500 text-xs truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => { scrollTo('reservations'); setProfileOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800 text-sm transition-colors"
                    >
                      My Reservations
                    </button>
                    <button
                      onClick={() => { setCartOpen(true); setProfileOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800 text-sm transition-colors"
                    >
                      My Cart {count > 0 && <span className="text-emerald-400">({count})</span>}
                    </button>
                    <div className="border-t border-zinc-800 mt-1">
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-zinc-800 text-sm transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleAuthClick}
                disabled={!accepted}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-white text-xs font-bold tracking-widest rounded-full transition-all duration-300 shadow-lg shadow-emerald-900/50"
                title={!accepted ? 'Please accept cookies to sign in' : ''}
              >
                SIGN IN
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-3">
            {isLoggedIn && (
              <button
                onClick={() => setCartOpen(true)}
                className="relative w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm"
              >
                🛒
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white w-8 h-8 flex flex-col justify-center gap-1.5"
              aria-label="Toggle menu"
            >
              <span className={`block h-px bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-px bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-px bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${
            isOpen ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-zinc-950/98 border-t border-emerald-900/30 px-6 py-8 space-y-5">
            {navLinks.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`block w-full text-left text-sm font-semibold tracking-widest transition-colors ${
                  activeSection === id ? 'text-emerald-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
            <div className="pt-4 border-t border-emerald-900/30 space-y-3">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">{initials}</div>
                    <span className="text-white text-sm font-semibold">{user?.name}</span>
                  </div>
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="w-full py-3 bg-zinc-800 text-red-400 text-sm font-bold tracking-widest rounded-xl transition-all"
                  >
                    SIGN OUT
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { handleAuthClick(); setIsOpen(false); }}
                  disabled={!accepted}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white text-sm font-bold tracking-widest rounded-xl transition-all"
                >
                  {accepted ? 'SIGN IN' : '🍪 ACCEPT COOKIES TO SIGN IN'}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;
