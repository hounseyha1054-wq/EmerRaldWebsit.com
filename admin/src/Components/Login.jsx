import React, { useState } from 'react'
import axios from 'axios'  
import { Url_backend } from '../App'
import { toast } from 'react-toastify'
const Login = ({ setToken }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const OnSubmitHandle = async (e) => {
    e.preventDefault()  
    try {
      const respone = await axios.post(Url_backend + '/api/user/admin', {
        email,
        password
      })

      if (respone.data.success) {
        setToken(respone.data.token)
        toast.success('Login successful!')
        
     
         
      } else {
        toast.error(respone.data.message || 'Login failed')
      }
    } catch (err) {
      console.log(err)
      toast.error(err.response?.data?.message || 'Invalid credentials!')
    }
  } 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Admin Login</h1>

        <form onSubmit={OnSubmitHandle} className="space-y-5">
          <div className="form-group">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              required
              type="email"
              placeholder="admin@example.com"
              name="email"
              autoComplete="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              name="password"
              autoComplete="current-password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 shadow-md"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          &copy; 2026 Admin Dashboard
        </p>
      </div>
    </div>
  )
}

export default Login