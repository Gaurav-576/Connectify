// import React from 'react'
import './globals.css';
import { Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </main>
  )
}

export default App
