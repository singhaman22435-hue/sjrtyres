import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { products as localProducts } from '../productsData';

// ─── Image Gallery with 3D tilt ──────────────────────────────────────────────
function ImageGallery({ product, activeImageIndex, setActiveImageIndex }) {
  const cardRef = useRef(null);

  const handleMove = (e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 14;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -14;
    cardRef.current.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg)`;
  };
  const handleLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <div className="w-full lg:w-1/2 flex flex-col gap-4 sticky top-28">
      {/* Main Image */}
      <div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)', willChange: 'transform' }}
        className="relative w-full aspect-square bg-white rounded-[2rem] overflow-hidden flex items-center justify-center p-8 border border-white/10 shadow-[0_0_40px_rgba(239,68,68,0.08)]"
      >
        <img
          key={activeImageIndex}
          src={product.images && product.images.length > 0 ? product.images[activeImageIndex] : product.image}
          alt={product.name}
          decoding="async"
          className="w-full h-full object-contain transition-all duration-500"
        />
        <div className="absolute top-6 left-6">
          <span className="px-4 py-1.5 bg-black/80 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/10 shadow-xl">
            {product.brand}
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      {product.images && product.images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {product.images.map((imgUrl, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`w-20 h-20 flex-shrink-0 bg-white rounded-xl overflow-hidden border-2 p-2 transition-all duration-300 ${
                activeImageIndex === idx
                  ? 'border-brand shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                  : 'border-transparent opacity-55 hover:opacity-100'
              }`}
            >
              <img loading="lazy" decoding="async" src={imgUrl} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const API_URL = import.meta.env.PROD ? '' : 'http://localhost:5005';
    fetch(`${API_URL}/api/products`)
      .then(res => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then(data => {
        const productList = (data && data.length > 0) ? data : localProducts;
        const found = productList.find(p => p.id === parseInt(id));
        setProduct(found);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching product, falling back to local:', err);
        const found = localProducts.find(p => p.id === parseInt(id));
        setProduct(found);
        setLoading(false);
      });
  }, [id]);

  if (loading || !product) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#080808]">
        <div className="w-12 h-12 border-2 border-brand border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white/40 text-sm tracking-widest uppercase">Loading Product...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#080808] text-white min-h-screen pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="flex items-center flex-wrap gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40 mb-12">
          <Link to="/products" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <ArrowLeft size={14} /> Back to Catalog
          </Link>
          <span className="text-white/20">/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-white transition-colors">
            {product.category}
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-brand">{product.name}</span>
        </div>

        {/* ── Main Product Layout ── */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

          {/* Left: Image Gallery */}
          <ImageGallery
            product={product}
            activeImageIndex={activeImageIndex}
            setActiveImageIndex={setActiveImageIndex}
          />

          {/* Right: Product Details */}
          <div className="w-full lg:w-1/2">

            {/* Category + Fitment badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-brand/10 border border-brand/20 rounded-full text-brand text-[10px] font-black uppercase tracking-widest">
                {product.category}
              </span>
              {product.fitment && (
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/50 text-[10px] font-bold uppercase tracking-widest">
                  {product.fitment} Axle
                </span>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-4xl md:text-5xl font-black mb-5 leading-tight tracking-tight">
              {product.name.split(' ')[0]}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-red-400">
                {product.name.split(' ').slice(1).join(' ') || product.name}
              </span>
            </h1>

            {/* PRODUCT DESCRIPTION - Styled like Catalog PDF */}
            <div className="mt-8 mb-8">
              <div className="inline-block bg-black border border-white/10 rounded-r-full rounded-l-md px-6 py-3 mb-6 relative overflow-hidden shadow-[5px_5px_15px_rgba(0,0,0,0.5)]">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand"></div>
                <h3 className="text-white text-sm md:text-base font-bold uppercase tracking-widest pl-2">Product Description</h3>
              </div>
              
              <ul className="space-y-4">
                {product.description && (
                  <li className="flex items-start gap-3 group">
                    <div className="w-2 h-2 rounded-full bg-brand mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.6)] group-hover:scale-150 transition-transform"></div>
                    <span className="text-white/80 text-sm md:text-base uppercase font-bold tracking-wider leading-relaxed">{product.description}</span>
                  </li>
                )}
                {product.applications && product.applications.map((app, idx) => (
                  <li key={idx} className="flex items-start gap-3 group">
                    <div className="w-2 h-2 rounded-full bg-brand mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.6)] group-hover:scale-150 transition-transform"></div>
                    <span className="text-white/80 text-sm md:text-base uppercase font-bold tracking-wider leading-relaxed">{app}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
