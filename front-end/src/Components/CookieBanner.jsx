import { useCookies } from '../context/CookieContext';

const CookieBanner = () => {
  const { accepted, accept, decline, pending } = useCookies();

  if (!pending) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 py-4 sm:px-6 sm:py-5">
      <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl shadow-black/60 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-600/20 border border-emerald-700/40 flex items-center justify-center text-lg">
          🍪
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm mb-1">We use cookies</p>
          <p className="text-zinc-400 text-xs leading-relaxed">
            We use cookies to personalise your experience, enable sign-in, and remember your preferences.
            By clicking <strong className="text-white">Accept All</strong>, you agree to our use of cookies.{' '}
            <a href="#" className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300 transition-colors">
              Learn more
            </a>
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-shrink-0 gap-3">
          <button
            onClick={decline}
            className="px-5 py-2.5 text-xs font-bold tracking-widest text-zinc-400 border border-zinc-700 hover:border-zinc-500 hover:text-white rounded-full transition-all duration-200"
          >
            DECLINE
          </button>
          <button
            onClick={accept}
            className="px-5 py-2.5 text-xs font-bold tracking-widest bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-all duration-200 shadow-lg shadow-emerald-950/50"
          >
            ACCEPT ALL
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
