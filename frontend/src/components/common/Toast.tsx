import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let colorClass = 'success';
        if (toast.type === 'error') {
          Icon = AlertCircle;
          colorClass = 'error';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          colorClass = 'warning';
        } else if (toast.type === 'info') {
          Icon = Info;
          colorClass = 'info';
        }

        return (
          <div key={toast.id} className={`toast-item ${colorClass}`}>
            <Icon size={18} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
              }}
              title="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
