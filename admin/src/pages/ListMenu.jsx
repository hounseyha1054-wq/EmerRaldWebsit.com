import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Url_backend } from '../App';
import { MdSearch, MdRestaurantMenu, MdDelete, MdEdit } from 'react-icons/md';

const CATEGORIES = ['All', 'Spaghetti', 'Noodles', 'Chicken', 'Drinks', 'Rice', 'Pizza'];

const ListMenu = ({ token }) => {
  const [list, setList] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const fetchList = async () => {
    try {
      const response = await axios.get(`${Url_backend}/api/product/list`, {
        headers: { token },
      });
      setList(Array.isArray(response.data) ? response.data : response.data.products || []);
    } catch (err) {
      toast.error('Error fetching menu items');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await axios.delete(`${Url_backend}/api/product/remove/${id}`, {
        headers: { token },
      });
      toast.success('Product deleted');
      fetchList();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const openEditForm = (product) => {
    setEditingProduct({ ...product });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', editingProduct.name);
      formData.append('price', editingProduct.price);
      formData.append('category', editingProduct.category);

      const response = await axios.put(
        `${Url_backend}/api/product/update/${editingProduct._id}`,
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Product updated!');
        setShowModal(false);
        await fetchList();
      }
    } catch (error) {
      toast.error('Update failed');
    }
  };

  useEffect(() => { fetchList(); }, []);

  const filtered = list.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  
  return (
    <div className="py-6 px-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Menu List</h1>
        <p className="text-sm text-gray-500 mt-1">{list.length} item{list.length !== 1 ? 's' : ''} total</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 text-gray-400">
          <MdRestaurantMenu className="text-6xl mb-4" />
          <p className="text-lg font-medium">
            {list.length === 0 ? 'No menu items yet' : 'No items match your search'}
          </p>
          <p className="text-sm">
            {list.length === 0
              ? 'Add menu items from the Add Menu page.'
              : 'Try a different search term or category.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-6 text-xs font-semibold uppercase text-gray-500 bg-gray-50 px-4 py-3 border-b border-gray-100">
            <p className="col-span-1">Image</p>
            <p className="col-span-2">Name</p>
            <p>Category</p>
            <p>Price</p>
            <p>Actions</p>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-50">
            {filtered.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-6 items-center px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-1">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-xl"
                  />
                </div>
                <p className="col-span-2 font-medium text-gray-800">{item.name}</p>
                <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full w-fit">
                  {item.category}
                </span>
                <p className="font-semibold text-gray-800">${item.price}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditForm(item)}
                    className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <MdEdit className="text-base" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(item._id)}
                    className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <MdDelete className="text-base" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-5">Edit Product</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {CATEGORIES.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListMenu;
