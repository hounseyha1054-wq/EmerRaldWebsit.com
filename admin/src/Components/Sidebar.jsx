import React from 'react'
import { NavLink } from 'react-router-dom'
import { IoAddCircleOutline, IoLogOutOutline } from 'react-icons/io5'
import { MdFormatListBulleted, MdDashboard, MdBarChart } from 'react-icons/md'
import { PiListBulletsFill } from "react-icons/pi"

const Sidebar = ({ setToken }) => {
  const linkClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      isActive 
        ? 'bg-emerald-600 text-white shadow-md' 
        : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
    }`;

  return (
     <div className="w-64 h-screen sticky top-0 bg-white border-r border-gray-200 flex flex-col p-4 shrink-0">
      
      <div className="px-4 mb-8">
        <h2 className="text-xl font-bold text-emerald-800 tracking-tight">Emerald Bistro</h2>
        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Admin Dashboard</p>
      </div>

      <nav className="flex-1 space-y-2">
        <NavLink to="/" end className={linkClass}>
          <MdDashboard className="text-xl" />
          <span className="font-medium">Dashboard</span>
        </NavLink>

        <NavLink to="/add" className={linkClass}>
          <IoAddCircleOutline className="text-xl" />
          <span className="font-medium">Add Menu</span>
        </NavLink>

        <NavLink to="/list" className={linkClass}>
          <MdFormatListBulleted className="text-xl" />
          <span className="font-medium">Menu List</span>
        </NavLink>

        <NavLink to="/table" className={linkClass}>
          <PiListBulletsFill className="text-xl" />
          <span className="font-medium">Reservations</span>
        </NavLink>

        <NavLink to="/report" className={linkClass}>
          <MdBarChart className="text-xl" />
          <span className="font-medium">Daily Report</span>
        </NavLink>
      </nav>

      <div className="pt-4 border-t border-gray-100">
        <button 
          onClick={() => setToken("")}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          <IoLogOutOutline className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar