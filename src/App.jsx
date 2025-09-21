import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Link } from 'react-router-dom'
import { BrowserRouter, Router, Route, Routes } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Home from './pages/Home'
import BottomNavbar from './components/BottomNavbar'
import Transactions from './pages/Transactions'

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="mb-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/transactions" element={<Transactions />} />
          </Routes>
        </div >
        <BottomNavbar />
      </BrowserRouter>
    </>
  )
}

export default App
