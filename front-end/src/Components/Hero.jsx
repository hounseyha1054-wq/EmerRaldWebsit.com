import bgImage from '../assets/hero.png';
import { useAuth } from '../context/AuthContext';
import { useCookies } from '../context/CookieContext';

const Hero = ({ onAuthRequired }) => {
  const { isLoggedIn } = useAuth();
  const { accepted } = useCookies();

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const handleBookClick = () => {
    if (!accepted) { scrollTo('reservations'); return; }
    if (!isLoggedIn) { onAuthRequired(); return; }
    scrollTo('reservations');
  };

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-zinc-950" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        {/* Location badge */}
        <div className="mb-8 animate-fade-in">
          <span className="inline-flex items-center gap-2 px-5 py-1.5 text-emerald-300 text-xs tracking-[5px] font-medium border border-emerald-700/50 rounded-full backdrop-blur-sm bg-emerald-950/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            PHNOM PENH • CAMBODIA
          </span>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-serif tracking-tighter text-white leading-none">
            EMERALD
          </h1>
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-serif tracking-tighter text-emerald-400 -mt-2 md:-mt-4">
            BISTRO
          </h2>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-emerald-500/60" />
          <span className="text-emerald-400/60 text-xs tracking-[6px] font-light">EST. 2024</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-emerald-500/60" />
        </div>

        {/* Tagline */}
        <p className="max-w-xl text-lg md:text-xl text-gray-300 font-light tracking-wide mb-12 leading-relaxed">
          Where timeless luxury meets&nbsp;
          <span className="text-emerald-300 italic">unforgettable dining</span>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleBookClick}
            className="group px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold tracking-widest rounded-full transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl shadow-emerald-950/60 hover:shadow-emerald-600/40 hover:-translate-y-0.5"
          >
            BOOK A TABLE
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </button>
          <button
            onClick={() => scrollTo('menu')}
            className="px-10 py-4 border border-white/30 hover:border-emerald-400/70 text-white hover:text-emerald-300 text-sm font-bold tracking-widest rounded-full transition-all duration-300 backdrop-blur-sm hover:-translate-y-0.5"
          >
            VIEW MENU
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-emerald-400/50">
        <span className="text-[10px] tracking-[4px] font-medium">SCROLL</span>
        <div className="w-px h-12 bg-gradient-to-b from-emerald-400/50 to-transparent" />
        <div className="w-1 h-1 rounded-full bg-emerald-400/50 animate-bounce" />
      </div>

      {/* Bottom fade into bg */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;
