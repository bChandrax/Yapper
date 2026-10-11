import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/dashboard/Dashboard'
import History from './pages/history/History'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<Dashboard />}/>
      <Route path="/history" element={<History />}/>
    </Routes>
  )
}

export default App
