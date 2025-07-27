import { useState } from 'react';
import AuthForm from '../components/AuthForm';

export default function AuthPage({ onAuthSuccess }) {
  const [error, setError] = useState('');

  const handleAuth = async (username, password, isLogin) => {
    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      // Updated to use production backend URL
      const response = await fetch(`https://plp-mern-wk-7-socketio-chat-render.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include' // Keep this for session/cookie handling
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || response.statusText);
      }

      const data = await response.json();
      onAuthSuccess(data.username || username);
    } catch (err) {
      setError(err.message || 'Authentication failed');
      console.error('Auth error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <AuthForm 
        onAuth={handleAuth} 
        error={error} 
        setError={setError}
      />
    </div>
  );
}