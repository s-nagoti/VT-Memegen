import { useState } from 'react'
import Register from '../../Pages/Register/Register'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuth } from '../../Contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import './App.css'

function App() {

  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (err) {
      console.error('Failed to logout', err)
    }
  }

  return (
    <>
    You are logged in!

    <div>
    <p>Want to logout?</p>
    <button onClick={handleLogout}>Logout</button>
    </div>
    </>
  )
}

export default App
