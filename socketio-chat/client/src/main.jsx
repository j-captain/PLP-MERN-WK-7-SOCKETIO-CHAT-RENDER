import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { io } from 'socket.io-client'

// Updated to use your current production backend URL
const socket = io(import.meta.env.VITE_API_URL || 'https://plp-mern-wk-7-socketio-chat-render.onrender.com', {
  withCredentials: true,
  autoConnect: false, // Maintained your manual connection approach
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket', 'polling'], // Added polling as fallback
  path: '/socket.io' // Explicit path to match server
})

// Enhanced development logging
if (import.meta.env.DEV) {
  socket.on('connect', () => {
    console.log('⚡️ WebSocket connected:', socket.id)
    console.log('🔗 Connection URL:', socket.io.uri)
  })

  socket.on('disconnect', (reason) => {
    console.log('⚠️ WebSocket disconnected:', reason)
  })

  socket.on('connect_error', (err) => {
    console.error('❌ Connection error:', err.message)
    console.error('🔄 Attempting reconnection...')
  })

  socket.on('reconnect', (attempt) => {
    console.log(`♻️ Reconnected after ${attempt} attempts`)
  })
}

// Make socket available via React context
export const SocketContext = React.createContext(socket)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SocketContext.Provider value={socket}>
      <App />
    </SocketContext.Provider>
  </React.StrictMode>
)