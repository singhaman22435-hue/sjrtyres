/**
 * useBackendWarmup.js
 * 
 * Solves Render.com free-tier "cold start" freezing.
 * 
 * Strategy:
 * 1. On first page load, immediately ping the backend to wake it up.
 * 2. Track wakeup state so UI can show "connecting..." gracefully.
 * 3. Keep-alive: ping every 10 minutes so server never goes idle again.
 */

import { useState, useEffect, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// ─── Internal: single shared warmup promise (runs once per tab) ────────────
let warmupPromise = null;
let isWarmedUp = false;

function pingBackend() {
  if (warmupPromise) return warmupPromise;
  
  warmupPromise = fetch(`${API_URL}/products?limit=1`, {
    method: 'GET',
    // Removed AbortSignal.timeout to prevent crashes on older browsers
  })
    .then(() => { isWarmedUp = true; })
    .catch(() => { isWarmedUp = true; }); // Even on error, mark as done so UI unblocks
  
  return warmupPromise;
}

// ─── Hook: exported for components that need to await backend ──────────────
export function useBackendWarmup() {
  const [ready, setReady] = useState(isWarmedUp);
  const keepAliveRef = useRef(null);

  useEffect(() => {
    // Immediately start warming up
    pingBackend().then(() => setReady(true));

    // Keep-alive: ping every 10 minutes to prevent Render from sleeping
    keepAliveRef.current = setInterval(() => {
      fetch(`${API_URL}/products?limit=1`, { method: 'GET' }).catch(() => {});
    }, 10 * 60 * 1000); // 10 minutes

    return () => {
      if (keepAliveRef.current) clearInterval(keepAliveRef.current);
    };
  }, []);

  return { ready };
}

// ─── Auto-start warmup immediately on first import ────────────────────────
// This means the ping fires as SOON as the JS bundle loads, not when component mounts
pingBackend();
