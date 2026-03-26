import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from '../src/context/auth-context.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
          <div className="min-h-screen bg-gray-100">
            <App />
          </div>
        </AuthProvider>
  </StrictMode>,
)
