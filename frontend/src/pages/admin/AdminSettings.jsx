import { useState } from 'react';
import { Settings, Lock, Bell, Shield, LogOut, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminSettings() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const handleSave = (e) => {
    e.preventDefault();
    if(passwords.new !== passwords.confirm) {
      alert("New passwords don't match!");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      
      {/* ── HEADER ── */}
      <div className="pb-6 border-b border-white/10">
        <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
          <Settings className="text-white/30 w-8 h-8" /> System Core Preferences
        </h1>
        <p className="text-white/40 mt-1 text-xs font-bold uppercase tracking-widest">Configure global overrides and identity</p>
      </div>

      {/* Security Block */}
      <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-colors">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 blur-[50px] pointer-events-none rounded-full"></div>
        
        <h2 className="text-lg font-bold text-white mb-8 border-b border-white/5 pb-4 flex items-center gap-3 relative z-10">
          <Lock className="text-brand w-5 h-5" /> Authentication & Security
        </h2>
        
        <form onSubmit={handleSave} className="max-w-md space-y-6 relative z-10">
          <div>
            <label className="block text-white/50 text-[10px] uppercase tracking-widest font-bold mb-2">Master Password Verification</label>
            <input type="password" required value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand/50 focus:bg-white/10 transition-colors text-sm font-mono tracking-widest" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-white/50 text-[10px] uppercase tracking-widest font-bold mb-2">New Access Key</label>
            <input type="password" required value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand/50 focus:bg-white/10 transition-colors text-sm font-mono tracking-widest" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-white/50 text-[10px] uppercase tracking-widest font-bold mb-2">Confirm Access Key</label>
            <input type="password" required value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand/50 focus:bg-white/10 transition-colors text-sm font-mono tracking-widest" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full py-4 bg-brand text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-red-700 transition-colors shadow-[0_0_20px_rgba(239,68,68,0.3)] flex items-center justify-center gap-2 mt-4">
            {saved ? <><Check size={16} /> Cipher Accepted</> : 'Override Key'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Notifications */}
        <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] pointer-events-none rounded-full"></div>
          
          <h2 className="text-lg font-bold text-white mb-8 border-b border-white/5 pb-4 flex items-center gap-3 relative z-10">
            <Bell className="text-blue-500 w-5 h-5" /> Ping Subscriptions
          </h2>
          
          <div className="space-y-6 relative z-10">
            <label className="flex items-center justify-between cursor-pointer group/label">
              <span className="text-white/60 font-bold text-sm group-hover/label:text-white transition-colors">Incoming Lead Alerts</span>
              <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
                <input type="checkbox" defaultChecked className="peer appearance-none w-5 h-5 border border-white/20 rounded bg-black transition-all checked:border-brand checked:bg-brand hover:border-brand/50 focus:outline-none cursor-pointer" />
                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </label>
            <label className="flex items-center justify-between cursor-pointer group/label">
              <span className="text-white/60 font-bold text-sm group-hover/label:text-white transition-colors">Daily Traffic Briefing</span>
              <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
                <input type="checkbox" className="peer appearance-none w-5 h-5 border border-white/20 rounded bg-black transition-all checked:border-brand checked:bg-brand hover:border-brand/50 focus:outline-none cursor-pointer" />
                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </label>
            <label className="flex items-center justify-between cursor-pointer group/label">
              <span className="text-white/60 font-bold text-sm group-hover/label:text-white transition-colors">Security Breach Warnings</span>
              <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
                <input type="checkbox" defaultChecked className="peer appearance-none w-5 h-5 border border-white/20 rounded bg-black transition-all checked:border-brand checked:bg-brand hover:border-brand/50 focus:outline-none cursor-pointer" />
                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-[#050505] border border-red-500/20 rounded-3xl p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden group hover:border-red-500/40 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[40px] pointer-events-none rounded-full group-hover:bg-red-500/10 transition-colors"></div>
          
          <div className="relative z-10">
            <h2 className="text-lg font-bold text-red-500 mb-3 flex items-center gap-3">
              <Shield className="text-red-500 w-5 h-5" /> Session Termination
            </h2>
            <p className="text-white/50 text-xs leading-relaxed mb-6">
              Securely sever the uplink to the Admin Console. You will be required to re-authenticate with your master credentials upon next access.
            </p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex justify-center items-center gap-3 w-full py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-bold rounded-xl transition-all duration-300 border border-red-500/20 text-xs uppercase tracking-widest relative z-10"
          >
            <LogOut size={16} /> Disconnect Subsystem
          </button>
        </div>
        
      </div>
    </div>
  );
}
