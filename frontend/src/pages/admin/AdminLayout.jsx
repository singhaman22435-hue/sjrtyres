import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, LogOut, Settings, Shield, Box, FileText, Search, Activity, Menu, X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const navLinks = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard", color: "group-hover:text-white" },
    { to: "/admin/products", icon: Package, label: "Products Database", color: "group-hover:text-purple-400" },
    { to: "/admin/inventory", icon: Box, label: "Inventory Stock", color: "group-hover:text-orange-400" },
    { to: "/admin/catalog", icon: BookOpen, label: "E-Catalog Manager", color: "group-hover:text-pink-400" },
    { to: "/admin/leads", icon: Users, label: "Order & Leads", color: "group-hover:text-blue-400" },
    { to: "/admin/cms", icon: FileText, label: "CMS & Content", color: "group-hover:text-green-400" },
    { to: "/admin/seo", icon: Search, label: "SEO Manager", color: "group-hover:text-yellow-400" },
    { to: "/admin/logs", icon: Activity, label: "Audit Logs", color: "group-hover:text-red-400" },
    { to: "/admin/settings", icon: Settings, label: "Settings", color: "group-hover:text-white/80" },
  ];

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden selection:bg-brand/30">
      
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#050505] border-r border-white/10 flex flex-col shadow-2xl transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Brand Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center border border-brand/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <Shield className="text-brand w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white leading-none tracking-tight mb-1">SJR Tyres</h2>
              <p className="text-[9px] uppercase tracking-widest text-brand font-bold">Admin Console</p>
            </div>
          </div>
          <button className="md:hidden text-white/50 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-5 space-y-1 overflow-y-auto scrollbar-hide">
          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4 mt-2 px-3">Main System</div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link 
                key={link.to} 
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                  isActive 
                    ? 'bg-brand text-white shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                    : `text-white/50 hover:bg-white/[0.03] hover:text-white group`
                }`}
              >
                <Icon size={18} className={`${isActive ? 'text-white' : `text-white/30 ${link.color}`} transition-colors`} /> 
                {link.label}
              </Link>
            );
          })}
        </nav>
        
        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-[#050505]">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 text-white/70 font-bold bg-white/5 hover:bg-brand border border-white/10 hover:border-brand p-4 rounded-xl w-full transition-all duration-300 text-xs uppercase tracking-widest"
          >
            <LogOut size={16} /> Disconnect
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-[#050505] border-b border-white/10 p-4 flex items-center justify-between z-30 shadow-sm relative">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center border border-brand/20">
              <Shield className="text-brand w-4 h-4" />
            </div>
            <h2 className="text-base font-black text-white leading-tight">SJR Admin</h2>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-white/70 p-2 focus:outline-none hover:text-white transition-colors">
            <Menu size={24} />
          </button>
        </header>

        {/* Page Content (Scrollable Container) */}
        <main className="flex-1 overflow-y-auto relative">
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand/[0.02] via-transparent to-transparent pointer-events-none z-0"></div>
          
          <div className="p-4 md:p-8 lg:p-10 relative z-10 w-full max-w-[1600px] mx-auto min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
      
    </div>
  );
}
