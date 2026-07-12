import { useContext, useState } from 'react';
import { categoryItem } from '../assets/assets/assets';
import { MenuContext } from '../context/Menucontext';
import MenuDetailModal from './MenuDetailModal';

const Menu = ({ onAuthRequired }) => {
  const { products } = useContext(MenuContext);
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = products.filter(
    (p) => category === 'All' || category === p.category
  );

  return (
    <>
      <section id="menu" className="bg-zinc-950 py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-16">
            <p className="text-emerald-400 text-xs tracking-[6px] font-semibold mb-4">CULINARY EXCELLENCE</p>
            <h2 className="text-5xl md:text-6xl font-serif text-white tracking-tight mb-6">Our Menu</h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-emerald-500/60" />
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-emerald-500/60" />
            </div>
            <p className="mt-6 text-gray-400 text-base max-w-xl mx-auto font-light leading-relaxed">
              Crafted with the finest seasonal ingredients, each dish tells a story of passion and tradition.
            </p>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categoryItem.map((item, index) => (
              <button
                key={index}
                onClick={() => setCategory(
                  category === item.category_title ? 'All' : item.category_title
                )}
                className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-widest transition-all duration-300 ${
                  category === item.category_title
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
                    : 'bg-zinc-900 text-gray-400 border border-zinc-700 hover:border-emerald-600/60 hover:text-emerald-400'
                }`}
              >
                {item.category_title.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Product grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <div
                  key={product._id}
                  className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-emerald-700/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-950/50 cursor-pointer"
                  onClick={() => setSelected(product)}
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />

                    {/* Price badge */}
                    <div className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-sm border border-emerald-700/50 px-3 py-1 rounded-full">
                      <span className="text-emerald-400 text-sm font-bold">${product.price}</span>
                    </div>

                    {/* Category tag */}
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[10px] font-bold tracking-widest text-emerald-300/80 uppercase bg-zinc-950/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-emerald-800/40">
                        {product.category}
                      </span>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-emerald-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-xs font-bold tracking-widest bg-zinc-950/70 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                        VIEW DETAILS
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="text-white font-semibold text-base leading-snug mb-3 group-hover:text-emerald-300 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 text-xs font-bold tracking-wider flex items-center gap-1.5">
                        VIEW DETAILS
                        <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                      </span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-emerald-500 text-xs">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-16 h-16 rounded-full border border-zinc-700 flex items-center justify-center mb-6">
                <span className="text-2xl">🍽️</span>
              </div>
              <p className="text-gray-500 text-lg font-light italic">No dishes found in this category.</p>
              <button
                onClick={() => setCategory('All')}
                className="mt-6 text-emerald-400 text-xs font-bold tracking-widest hover:text-emerald-300 transition-colors"
              >
                VIEW ALL →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Detail modal */}
      {selected && (
        <MenuDetailModal
          product={selected}
          onClose={() => setSelected(null)}
          onAuthRequired={() => { setSelected(null); onAuthRequired(); }}
        />
      )}
    </>
  );
};

export default Menu;
