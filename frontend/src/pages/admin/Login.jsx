import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, User, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
      const res = await axios.post(`${API_URL}/api/admin/login`, { username, password });
      if (res.data.token) {
        localStorage.setItem('adminToken', res.data.token);
        navigate('/admin');
      }
    } catch (err) {
      setError('Invalid User ID or Password. (Hint: use admin / admin)');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden p-4">
      
      {/* Background Ambience */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(239,68,68,0.1) 0%, transparent 60%)' }}
      />
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-[0_0_50px_rgba(239,68,68,0.05)]">
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-brand/20 shadow-[0_0_30px_rgba(239,68,68,0.2)] transform rotate-3">
              <Shield className="text-brand w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Admin Console</h2>
            <p className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-bold">Secure Access Only</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-center text-xs font-bold uppercase tracking-widest"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-white/50 text-[10px] font-bold uppercase tracking-widest mb-2">System ID</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5 group-focus-within:text-brand transition-colors" />
                <input 
                  type="text" 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand/50 focus:bg-white/10 transition-all font-mono text-sm"
                  placeholder="Enter System ID"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-white/50 text-[10px] font-bold uppercase tracking-widest mb-2">Access Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5 group-focus-within:text-brand transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand/50 focus:bg-white/10 transition-all font-mono text-sm tracking-widest"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_35px_rgba(239,68,68,0.5)] flex items-center justify-center gap-2 mt-8 text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Initialize Uplink'} <Lock size={14} />
            </button>
          </form>

        </div>
      </motion.div>
    </div>
  );
}
