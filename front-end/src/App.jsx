import React from 'react'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Homepage from './pages/Homepage'
import { Routes,Route } from 'react-router-dom'
export const Url_backend ='http://localhost:4000'
import { ToastContainer } from 'react-toastify'
const App = () => {
  return (
    <div>
        <ToastContainer position='top-right' />
       <Navbar/>
       <Routes>
          <Route path="/" element={<Homepage/>}/>
          
       </Routes>
       <Footer/>

    </div>
  )
}

export default App
