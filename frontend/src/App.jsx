import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ServerWakeup from './components/ServerWakeup';
// Immediately wake up Render.com backend on first bundle load
import './useBackendWarmup';

// Lazy loading all pages for performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Products = lazy(() => import('./pages/Products'));
const Catalog = lazy(() => import('./pages/Catalog'));
const Warranty = lazy(() => import('./pages/Warranty'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminLeads = lazy(() => import('./pages/admin/AdminLeads'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminInventory = lazy(() => import('./pages/admin/AdminInventory'));
const AdminCatalog = lazy(() => import('./pages/admin/AdminCatalog'));
const AdminCMS = lazy(() => import('./pages/admin/AdminCMS'));
const AdminSEO = lazy(() => import('./pages/admin/AdminSEO'));
const AdminLogs = lazy(() => import('./pages/admin/AdminLogs'));

// Minimal page-transition skeleton
const PageSkeleton = () => (
  <div className="min-h-screen bg-[#080808] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
  </div>
);

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {/* CSS-only scroll progress bar */}
      {!isAdmin && <div className="scroll-progress" />}
      {/* Backend cold-start notification */}
      <ServerWakeup />
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-[#080808] text-text-primary font-body relative selection:bg-brand selection:text-white">
        {!isAdmin && <Navbar />}
        <main className="flex-grow relative z-10">
          <Suspense fallback={<PageSkeleton />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/warranty" element={<Warranty />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/contact" element={<Contact />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="leads" element={<AdminLeads />} />
                  <Route path="inventory" element={<AdminInventory />} />
                  <Route path="catalog" element={<AdminCatalog />} />
                  <Route path="cms" element={<AdminCMS />} />
                  <Route path="seo" element={<AdminSEO />} />
                  <Route path="logs" element={<AdminLogs />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </main>
        {!isAdmin && <Footer />}
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
