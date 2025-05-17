import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Removing StrictMode to avoid issues with react-beautiful-dnd
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
