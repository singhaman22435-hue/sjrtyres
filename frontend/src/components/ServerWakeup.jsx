/**
 * ServerWakeup.jsx
 * 
 * A beautiful fullscreen banner shown during Render cold-start.
 * Only visible when backend is waking up AND the user tries to interact.
 * Auto-dismisses once backend is ready.
 */

import { useEffect, useState } from 'react';
import { useBackendWarmup } from '../useBackendWarmup';

export default function ServerWakeup() {
  const { ready } = useBackendWarmup();
  const [visible, setVisible] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (ready) {
      setVisible(false);
      return;
    }

    // Show banner only after 2s delay (so fast responses don't flash it)
    const showTimer = setTimeout(() => {
      if (!ready) setVisible(true);
    }, 2000);

    // Count seconds
    const counter = setInterval(() => {
      setElapsed(s => s + 1);
    }, 1000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(counter);
    };
  }, [ready]);

  if (!visible || ready) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a0a0a 100%)',
        border: '1px solid rgba(239,68,68,0.3)',
        borderRadius: 16,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(239,68,68,0.1)',
        maxWidth: 320,
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Animated spinner */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '3px solid rgba(239,68,68,0.15)',
          borderTopColor: '#ef4444',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>

      {/* Text */}
      <div>
        <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
          Server Warming Up...
        </p>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, margin: '3px 0 0', lineHeight: 1.4 }}>
          Free server waking from sleep ({elapsed}s)
        </p>
      </div>
    </div>
  );
}
