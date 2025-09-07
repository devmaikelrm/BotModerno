import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, opts = {}) => {
    const id = Date.now().toString();
    const toast = {
      id,
      message,
      type: opts.type || 'info', // info | success | error | warning
      ttl: typeof opts.ttl === 'number' ? opts.ttl : 5000
    };
    setToasts((t) => [...t, toast]);
    if (toast.ttl > 0) {
      setTimeout(() => {
        setToasts((t) => t.filter(x => x.id !== id));
      }, toast.ttl);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter(x => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div style={{
        position: 'fixed',
        right: 20,
        bottom: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        zIndex: 9999,
        maxWidth: 360
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            padding: '12px 16px',
            borderRadius: 10,
            background: t.type === 'error' ? '#fee2e2' : (t.type === 'success' ? '#dcfce7' : '#fff'),
            border: '1px solid var(--border)',
            color: t.type === 'error' ? '#991b1b' : (t.type === 'success' ? '#166534' : 'var(--text)'),
            boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
            fontSize: 14
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1 }}>{t.message}</div>
              <button onClick={() => removeToast(t.id)} style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--muted)'
              }}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}