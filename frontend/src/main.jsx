import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './ThemeContext.jsx'
import SiteHelpWidget from './components/SiteHelpWidget.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
      <SiteHelpWidget />
    </ThemeProvider>
  </React.StrictMode>,
)
