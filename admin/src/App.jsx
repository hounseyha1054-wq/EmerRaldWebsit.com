import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Login from './Components/Login'
import Sidebar from './Components/Sidebar' 
import AdminMenu from './pages/AdminMenu.jsx'
import ListMenu from './pages/ListMenu.jsx'
import AdminTable from './pages/AdminTable.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ReportPage from './pages/ReportPage.jsx'
export const Url_backend = 'http://localhost:4000'

const App = () => {

   const [token, settoken] = useState(localStorage.getItem('token') || "")

  useEffect(() => {
   if(token) {
    localStorage.setItem('token', token)
   } else {
    localStorage.removeItem('token')
   }
  },[token])


   return (
     
      <div className="min-h-screen bg-gray-50">
        <ToastContainer position='top-right' />
        {
        token ==="" ? (<Login setToken={settoken} />) : (
          <>
          <div className="flex items-start"> 
            <Sidebar setToken={settoken} />
            
            <div className="flex-1">
              <Routes>
              
                <Route path='/' element={<Dashboard token={token} />} />
                <Route path='/add' element={<AdminMenu token={token} />} />
                <Route path='/list' element={<ListMenu token={token} />} />
                <Route path='/table' element={<AdminTable token={token} />} />
                <Route path='/report' element={<ReportPage token={token} />} />
              </Routes>
            </div>
          </div>
          </>
        )}

      </div>
       
      
    
  )
}

export default App