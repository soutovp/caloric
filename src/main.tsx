import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import Index from './pages/Index'
import Resultado from './pages/Resultado'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Index/>}/>
        <Route path="/resultado" element={<Resultado/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
