import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCookies } from '../context/CookieContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const MenuDetailModal = ({ product, onClose, onAuthRequired }) => {
  const { isLoggedIn } = useAuth();
  const { accepted } = useCookies();
  const { addItem, items } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const cartItem = items.find((i) => i.product._id === product._id);

  const handleAddToCart = () => {
    if (!accepted) {
      toast.warn('Please accept cookies to continue.');
      return;
    }
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }
    for (let i = 0; i < qty; i++) addItem(product);
    toast.success(`${product.name} added to cart!`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-black/75 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl bg-zinc-900 rounded-3xl border border-zinc-800 shadow-2xl shadow-black/60 overflow-hidden">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-zinc-800/80 backdrop-blur-sm hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all flex items-center justify-center text-sm"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative h-64 md:h-auto overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-900/30" />
            {/* Price badge */}
            <div className="absolute top-4 left-4 bg-zinc-950/80 backdrop-blur-sm border border-emerald-700/50 px-4 py-1.5 rounded-full">
              <span className="text-emerald-400 font-bold text-lg">${product.price}</span>
            </div>
          </div>

          {/* Details */}
          <div className="p-7 flex flex-col justify-between">
            <div>
              {/* Category */}
              <span className="inline-block text-[10px] font-bold tracking-widest text-emerald-400 uppercase bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 rounded-full mb-4">
                {product.category}
              </span>

              {/* Name */}
              <h2 className="text-2xl font-serif text-white leading-snug mb-4">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-emerald-500 text-sm">★</span>
                  ))}
                </div>
                <span className="text-zinc-500 text-xs">(4.9 · 120 reviews)</span>
              </div>

              {/* Description */}
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                {product.description ||
                  'A carefully crafted dish made with the finest seasonal ingredients. Each bite delivers a perfect balance of flavour and texture.'}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['Fresh', 'Chef\'s Special', 'Popular'].map((tag) => (
                  <span key={tag} className="text-[10px] font-semibold tracking-wide text-zinc-400 bg-zinc-800 border border-zinc-700 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Qty + Add to cart */}
            <div>
              {/* Quantity */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Quantity</span>
                <div className="flex items-center gap-3 bg-zinc-800 rounded-xl px-3 py-2 border border-zinc-700">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="text-zinc-400 hover:text-white transition-colors w-5 text-center font-bold"
                  >
                    −
                  </button>
                  <span className="text-white font-bold w-5 text-center">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="text-zinc-400 hover:text-white transition-colors w-5 text-center font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-zinc-500 text-sm">
                  = <span className="text-emerald-400 font-bold">${product.price * qty}</span>
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                {!accepted
                  ? '🍪 ACCEPT COOKIES TO ORDER'
                  : !isLoggedIn
                  ? '🔒 SIGN IN TO ORDER'
                  : cartItem
                  ? `ADD MORE (${cartItem.qty} in cart)`
                  : 'ADD TO CART'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDetailModal;
