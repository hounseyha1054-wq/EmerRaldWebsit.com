import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const CartDrawer = ({ open, onClose }) => {
  const { items, removeItem, updateQty, total, clearCart } = useCart();
  const { isLoggedIn } = useAuth();

  const handleOrder = () => {
    if (!isLoggedIn) {
      toast.error('Please sign in to place an order');
      return;
    }
    if (items.length === 0) {
      toast.warn('Your cart is empty');
      return;
    }
    // Placeholder — connect to order API later
    toast.success('Order placed successfully! 🎉');
    clearCart();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-[160] h-full w-full max-w-md bg-zinc-900 border-l border-zinc-800 shadow-2xl transition-transform duration-400 flex flex-col ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <div>
            <h2 className="text-white font-serif text-xl">Your Order</h2>
            <p className="text-zinc-500 text-xs mt-0.5">{items.length} item{items.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="text-5xl mb-4">🛒</div>
              <p className="text-zinc-400 font-light">Your cart is empty</p>
              <p className="text-zinc-600 text-sm mt-2">Add items from the menu to get started.</p>
            </div>
          ) : (
            items.map(({ product, qty }) => (
              <div key={product._id} className="flex gap-4 bg-zinc-800/60 rounded-2xl p-3 border border-zinc-700/50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold leading-snug line-clamp-1">{product.name}</p>
                  <p className="text-emerald-400 text-sm font-bold mt-0.5">${product.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(product._id, qty - 1)}
                      className="w-6 h-6 rounded-full bg-zinc-700 hover:bg-zinc-600 text-white text-xs flex items-center justify-center transition-colors"
                    >
                      −
                    </button>
                    <span className="text-white text-sm font-bold w-4 text-center">{qty}</span>
                    <button
                      onClick={() => updateQty(product._id, qty + 1)}
                      className="w-6 h-6 rounded-full bg-zinc-700 hover:bg-zinc-600 text-white text-xs flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(product._id)}
                    className="text-zinc-600 hover:text-red-400 transition-colors text-xs"
                    aria-label="Remove item"
                  >
                    ✕
                  </button>
                  <span className="text-zinc-300 text-sm font-bold">${product.price * qty}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Subtotal</span>
              <span className="text-white font-bold text-lg">${total}</span>
            </div>
            <button
              onClick={handleOrder}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-widest rounded-xl transition-all duration-300 shadow-lg shadow-emerald-950/50"
            >
              PLACE ORDER — ${total}
            </button>
            <button
              onClick={clearCart}
              className="w-full text-center text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
