import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import axios from "axios";
import { Url_backend } from "../App";

const ListMenu = ({ token }) => {
  const [list, setList] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);  
  const [showModal, setShowModal] = useState(false); 
 

  
  const fetchList = async () => {
    try {
      const response = await axios.get(`${Url_backend}/api/product/list`, {
        headers: { token },
      });
      
      setList(Array.isArray(response.data) ? response.data : response.data.products);
    } catch (err) {
      toast.error("Error fetching menu items");
    }
  };

 
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      await axios.delete(`${Url_backend}/api/product/remove/${id}`, {
        headers: { token }  
      });
      toast.success("Product deleted");
      fetchList();
    } catch (error) {
      toast.error("Failed to delete");
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
      formData.append("name", editingProduct.name);
      formData.append("price", editingProduct.price);
      formData.append("category", editingProduct.category);
       
      const response = await axios.put(
        `${Url_backend}/api/product/update/${editingProduct._id}`, 
        formData, 
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Product updated!");
        setShowModal(false);
       await fetchList();
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  useEffect(() => { fetchList(); }, []);

  return (
    <div className='py-6 px-6'>
      <h1 className='text-2xl font-bold mb-4'>Menu List</h1>

       <div className="grid grid-cols-5 font-bold border-b py-2 bg-gray-100 px-2">
        <p>Image</p>
        <p>Name</p>
        <p>Category</p>
        <p>Price</p>
        <p>Actions</p>
      </div>

       
      {list.map((item) => (
        <div key={item._id} className="grid grid-cols-5 items-center border-t py-2 px-2 hover:bg-gray-50">
          <img src={item.image} alt="" className="w-16 h-16 object-cover rounded" />
          <p>{item.name}</p>
          <p className="text-gray-600">{item.category}</p>
          <p className="font-semibold">${item.price}</p>
          <div className="flex gap-2">
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded" 
              onClick={() => openEditForm(item)}
            >
              Edit
            </button>
            <button 
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded" 
              onClick={() => deleteProduct(item._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

    
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Product Name</label>
                <input 
                  type="text" 
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="w-full border p-2 rounded" required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Price ($)</label>
                <input 
                  type="number" 
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                  className="w-full border p-2 rounded" required 
                />
              </div>
             
              <div>
                <label className="block text-sm font-medium">Category</label>
                <input 
                  type="text" 
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                  className="w-full border p-2 rounded" required 
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded flex-1">Save Changes</button>
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-300 px-4 py-2 rounded flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListMenu;