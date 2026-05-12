import React, { useState } from "react";
import url_image from "../assets/image_upload.png";
import { toast } from "react-toastify";
import axios from "axios";
import  {Url_backend}  from "../App";
const AdminMenu = ({ token }) => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
      e.preventDefault();
    try {
     
      if (!image || !name || !description || !price || !category) {
        toast.error("Please fill in all fields");
        return;
      }
      const formdata = new FormData();

      formdata.append("name", name);
      formdata.append("description", description);
      formdata.append("price", price);
      formdata.append("category", category);
      if (image) formdata.append("image", image);

     const response = await axios.post(
              `${Url_backend}/api/product/add`,
              formdata,
              {
                headers: {
                  token,
                },
              });
  
      if (response.data.success) {
        toast.success(response.data.message);
        setImage(null);
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
      } else {
        toast.error(response.data.message);
      }
    }catch (err) {
        console.log(err.response?.data);

        toast.error(
          err.response?.data?.message || "Error adding menu item"
        );
    }
  };

  return (
    <div className="h-full bg-gray-50 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">
          Store Management
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Add New Menu Item
        </h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
            <label
              htmlFor="image"
              className="cursor-pointer flex flex-col items-center"
            >
              <img
                src={!image ? url_image : URL.createObjectURL(image)}
                alt="Upload Preview"
                className="w-40 h-40 object-cover rounded-lg shadow-sm mb-3"
              />
              <span className="text-sm text-gray-600 font-medium">
                Click to upload product image
              </span>
              <span className="text-xs text-gray-400 mt-1">
                PNG, JPG up to 10MB
              </span>
            </label>

            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
            />
          </div>

     
          <div className="space-y-4">
     
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                placeholder="e.g. Spicy Spaghetti"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

             
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows="3"
                placeholder="Describe the ingredients..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

          
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Price ($)"
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="All">All</option>
                <option value="Spaghetti">Spaghetti</option>
                <option value="Noodles">Noodles</option>
                <option value="Chicken">Chicken</option>
                <option value="Drinks">Drinks</option>
                <option value="Rice">Rice</option>
                <option value="Pizza">Pizza</option>
              </select>
            </div>

          
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-md hover:bg-indigo-700 transition"
            >
              Add to Menu
            </button>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminMenu;
