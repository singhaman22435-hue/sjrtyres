import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, ShieldCheck, Clock } from 'lucide-react';

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
      const response = await axios.get(`${API_URL}/api/admin/logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ── HEADER ── */}
      <div className="pb-6 border-b border-white/10">
        <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
          <Activity className="text-red-500 w-8 h-8" /> Security & Audit Trails
        </h1>
        <p className="text-white/40 mt-1 text-xs font-bold uppercase tracking-widest">Immutable log of system modifications</p>
      </div>

      <div className="bg-[#050505] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand/10 border border-brand/20 rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-brand w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Global Watchdog Active</span>
          </div>
          <div className="flex items-center gap-2 text-green-500 text-[10px] font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Secured
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-white/60 min-w-[700px]">
            <thead className="bg-[#050505] border-b border-white/5 text-white uppercase tracking-widest text-[10px] font-bold">
              <tr>
                <th className="px-6 py-5">Time Signature</th>
                <th className="px-6 py-5">Operator ID</th>
                <th className="px-6 py-5">Event Action</th>
                <th className="px-6 py-5">Data Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-white/[0.01]">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center text-white/40 text-xs font-bold uppercase tracking-widest animate-pulse">
                    Decrypting Trails...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center text-white/30 text-xs font-bold uppercase tracking-widest">
                    No activity recorded.
                  </td>
                </tr>
              ) : logs.map(log => (
                <tr key={log.id} className="hover:bg-white/[0.03] transition-colors font-mono text-xs group">
                  <td className="px-6 py-4 flex items-center gap-3 text-white/50">
                    <Clock size={12} className="text-white/20 group-hover:text-brand transition-colors" />
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-brand/10 text-brand border border-brand/20 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {log.user_id}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-white">{log.action}</td>
                  <td className="px-6 py-4">
                    <div className="bg-black/50 border border-white/5 rounded-lg p-3 text-white/70 max-w-sm truncate group-hover:text-white transition-colors" title={JSON.stringify(log.details)}>
                      {JSON.stringify(log.details)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
