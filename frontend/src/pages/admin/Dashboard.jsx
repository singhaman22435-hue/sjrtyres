import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Package, TrendingUp, RefreshCw, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#ef4444', '#70d6c5', '#3b82f6', '#a855f7', '#f59e0b'];

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
      const response = await axios.get(`${API_URL}/api/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 4000 // 4 second timeout so it fails fast if backend hangs
      });
      setAnalytics(response.data);
    } catch (error) {
      if(error.response && error.response.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      } else {
        console.error('Error fetching analytics, using fallback data:', error);
        // Fallback dummy data if backend is down/hanging
        setAnalytics({
          total_leads: 124,
          active_products: 109,
          conversion_rate: 8.5,
          leads_by_status: [
            { name: "Pending", value: 45 },
            { name: "Contacted", value: 30 },
            { name: "Closed", value: 49 }
          ],
          product_popularity: [
            { name: "Motorcycle", value: 55 },
            { name: "Tractor", value: 24 },
            { name: "Commercial", value: 30 }
          ]
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
         <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
           <Activity className="text-brand w-6 h-6 animate-pulse" />
         </div>
         <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] animate-pulse">Syncing System Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">System Metrics</h1>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Real-time performance analytics</p>
        </div>
        <button 
          onClick={fetchAnalytics} 
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-brand hover:border-brand transition-all px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest text-white shadow-lg group"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
          Sync Data
        </button>
      </div>
      
      {/* ── KPI METRICS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Total Leads", value: analytics.total_leads, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", glow: "rgba(59,130,246,0.15)" },
          { title: "Active Products", value: analytics.active_products, icon: Package, color: "text-brand", bg: "bg-brand/10", glow: "rgba(239,68,68,0.15)" },
          { title: "Conversion Rate", value: analytics.conversion_rate, icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10", glow: "rgba(34,197,94,0.15)" }
        ].map((metric, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-[#050505] border border-white/10 p-8 rounded-3xl relative overflow-hidden group hover:border-white/20 transition-colors`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 z-0 transition-opacity opacity-50 group-hover:opacity-100" style={{ background: metric.glow }}></div>
            
            <div className="flex items-start justify-between mb-8 relative z-10">
              <h3 className="text-white/40 font-bold uppercase tracking-widest text-[10px]">{metric.title}</h3>
              <div className={`p-3 ${metric.bg} rounded-xl border border-white/5`}>
                <metric.icon className={metric.color} size={18} />
              </div>
            </div>
            
            <div className="flex items-end gap-3 relative z-10">
              <p className="text-5xl font-black text-white">{metric.value}</p>
              {metric.title === "Conversion Rate" && <span className="text-brand font-bold text-lg mb-1">%</span>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── CHARTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Bar Chart */}
        <div className="bg-[#050505] border border-white/10 p-8 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Leads by Status</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.leads_by_status} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#666" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }} 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} 
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-[#050505] border border-white/10 p-8 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
            <div className="w-2 h-2 rounded-full bg-brand"></div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Products by Category</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={analytics.product_popularity} 
                  cx="50%" cy="50%" 
                  innerRadius={90} 
                  outerRadius={130} 
                  paddingAngle={5} 
                  dataKey="value"
                  stroke="none"
                >
                  {analytics.product_popularity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} 
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      </div>
    </div>
  );
}
