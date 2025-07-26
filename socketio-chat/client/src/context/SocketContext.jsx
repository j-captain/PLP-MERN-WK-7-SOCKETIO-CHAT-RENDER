import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Create Socket Context
const SocketContext = createContext();



export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [reconnectionAttempts, setReconnectionAttempts] = useState(0);

  // Determine backend URL based on environment
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Connection status tracking
  useEffect(() => {
    console.log(`⚡ Connecting to backend: ${backendUrl}`);
    
    const newSocket = io(backendUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket'],
      withCredentials: true,
      path: '/socket.io'
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setIsConnected(true);
      setConnectionError(null);
    });

    newSocket.on('disconnect', (reason) => {
      console.warn('⚠ Socket disconnected:', reason);
      setIsConnected(false);
      if (reason === 'io server disconnect') {
        console.log('🔄 Reconnecting to server...');
        newSocket.connect();
      }
    });

    newSocket.on('connect_error', (err) => {
      console.error('🔌 Connection error:', err.message);
      setConnectionError(err.message);
      setReconnectionAttempts(prev => prev + 1);
      
      // Try to reconnect after 3 seconds
      setTimeout(() => {
        console.log('🔄 Attempting reconnect...');
        newSocket.connect();
      }, 3000);
    });

    newSocket.on('reconnect', (attempt) => {
      console.log(`♻️ Reconnected after ${attempt} attempts`);
      setConnectionError(null);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('❌ Reconnection failed');
      setConnectionError('Unable to connect to server after multiple attempts');
    });

    // Custom heartbeat monitoring
    newSocket.on('💓', (start) => {
      newSocket.emit('💗', start);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up socket connection');
      newSocket.disconnect();
      newSocket.removeAllListeners();
    };
  }, [backendUrl]);

  // Context value
  const contextValue = {
    socket,
    isConnected,
    connectionError,
    reconnectionAttempts,
    backendUrl
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};