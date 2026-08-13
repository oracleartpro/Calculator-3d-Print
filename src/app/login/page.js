'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // Silakan ubah 'admin' dan 'kobra2200va' di bawah ini jika ingin mengganti password Anda
    if (username === 'admin' && password === 'kobra2200va') {
      localStorage.setItem('isLoggedIn', 'true');
      router.push('/dashboard');
    } else {
      setError('Username atau password salah!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 p-4">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-800 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-purple-400">3D Print Cost Dashboard</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-400">Username</label>
            <input type="text" className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-purple-500" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-400">Password</label>
            <input type="password" className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-purple-500" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 transition p-3 rounded-lg font-semibold mt-6 text-white shadow-lg">
            Masuk ke Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
