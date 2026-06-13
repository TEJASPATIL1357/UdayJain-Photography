import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to sign in. Please check your credentials or Firebase config.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-black-main flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-charcoal border border-white/10 p-8 rounded-xl shadow-2xl"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center text-gold">
            <Lock size={32} />
          </div>
        </div>

        <h2 className="text-3xl font-playfair text-white text-center mb-2">Admin Portal</h2>
        <p className="text-soft-gray text-center text-sm font-light mb-8">Authorized personnel only.</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-soft-gray text-xs uppercase tracking-widest mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black-main border border-white/10 p-3 text-white focus:outline-none focus:border-gold transition-colors rounded"
            />
          </div>
          <div>
            <label className="block text-soft-gray text-xs uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black-main border border-white/10 p-3 text-white focus:outline-none focus:border-gold transition-colors rounded"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gold text-black-main font-inter text-sm tracking-widest uppercase py-3 hover:bg-white transition-colors rounded disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
