import React, { useContext, useState } from 'react'
import { categoryItem } from '../assets/assets/assets'
import { MenuContext } from '../context/Menucontext'
const Menu = () => {
  const { products } = useContext(MenuContext)
  const [category, setcategory] = useState("All")

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
     
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Discover Our Menu
        </h1>
        <div className="mt-4 h-1 w-24 bg-orange-500 mx-auto rounded-full"></div>
      </div>

      
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center uppercase tracking-widest">
          Explore our category
        </h2>
        <ul className="flex flex-wrap justify-center gap-4">
          {categoryItem.map((item, index) => (
            <li
              key={index}
              onClick={() =>
                setcategory((prev) =>
                  prev === item.category_title ? "All" : item.category_title
                )
              }
              className={`px-6 py-2 rounded-full cursor-pointer transition-all duration-300 border-2 font-medium
                ${category === item.category_title 
                  ? "bg-orange-500 border-orange-500 text-white shadow-lg scale-105" 
                  : "bg-white border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500"
                }`}
            >
              {item.category_title}
            </li>
          ))}
        </ul>
      </div>

   
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        { products.length > 0 ?(
          products
            .filter((p) => category === "All" || category === p.category)
            .map((product) => (
              <div 
                key={product._id} 
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm">
                    <span className="text-orange-600 font-bold">${product.price}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h1 className="text-xl font-bold text-gray-800 mb-2 truncate">
                    {product.name}
                  </h1>
                  <div className="flex justify-between items-center mt-4">
                    <button className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
                      View Details →
                    </button>
                    <span className="text-xs text-gray-400 uppercase tracking-tighter">
                      {product.category}
                    </span>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-400 text-xl italic font-light">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Menu