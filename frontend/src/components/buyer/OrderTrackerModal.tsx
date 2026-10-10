import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
} from 'lucide-react';
import type { OrderStatus } from '../../types';

export const OrderTrackerModal: React.FC = () => {
  const { selectedOrderId, setSelectedOrderId, orders } = useStore();

  if (!selectedOrderId) return null;

  const order = orders.find((o) => o.id === selectedOrderId);
  if (!order) return null;

  const stepsOrder: { status: OrderStatus; label: string; icon: any }[] = [
    { status: 'pending', label: 'Order Placed', icon: Clock },
    { status: 'processing', label: 'Processing', icon: Package },
    { status: 'shipped', label: 'Dispatched', icon: Truck },
    { status: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
    { status: 'delivered', label: 'Delivered', icon: CheckCircle2 },
  ];

  const currentStatusIdx = stepsOrder.findIndex((s) => s.status === order.status);

  return (
    <div className="modal-overlay" onClick={() => setSelectedOrderId(null)}>
      <div
        className="modal-content"
        style={{ maxWidth: '720px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package size={20} color="var(--primary)" />
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Live Order Tracker</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Order #{order.orderNumber} • Tracking: {order.trackingNumber}
              </span>
            </div>
          </div>
          <button
            onClick={() => setSelectedOrderId(null)}
            className="icon-action-btn"
            style={{ width: '32px', height: '32px' }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Estimated Delivery Banner */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.15))',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.78rem', color: '#A5B4FC', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                Estimated Delivery
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
                {order.estimatedDelivery}
              </div>
            </div>
            <span
              className={`status-pill ${
                order.status === 'delivered'
                  ? 'success'
                  : order.status === 'cancelled'
                  ? 'danger'
                  : 'warning'
              }`}
              style={{ fontSize: '0.82rem', padding: '6px 14px' }}
            >
              {order.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {/* Visual Step-by-Step Progress Pipeline */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              {/* Connecting line */}
              <div
                style={{
                  position: 'absolute',
                  top: '18px',
                  left: '30px',
                  right: '30px',
                  height: '3px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #6366F1, #06B6D4)',
                    width: `${Math.max(0, Math.min(100, (currentStatusIdx / (stepsOrder.length - 1)) * 100))}%`,
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>

              {stepsOrder.map((step, idx) => {
                const IconComponent = step.icon;
                const isCompleted = idx <= currentStatusIdx;
                const isCurrent = idx === currentStatusIdx;

                return (
                  <div
                    key={step.status}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      zIndex: 2,
                    }}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: isCompleted ? '#6366F1' : '#1F2937',
                        border: `2px solid ${isCurrent ? '#06B6D4' : isCompleted ? '#6366F1' : 'rgba(255, 255, 255, 0.2)'}`,
                        color: isCompleted ? '#FFFFFF' : 'var(--text-dim)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isCurrent ? '0 0 16px rgba(6, 182, 212, 0.6)' : 'none',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <IconComponent size={18} />
                    </div>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        color: isCompleted ? '#FFFFFF' : 'var(--text-dim)',
                        marginTop: '8px',
                        textAlign: 'center',
                        maxWidth: '70px',
                      }}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity / Milestone Timeline */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '14px', color: 'var(--text-muted)' }}>
              Milestone Activity History
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {order.timeline.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '12px 16px',
                    background: step.completed ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${step.completed ? 'var(--border-subtle)' : 'transparent'}`,
                    opacity: step.completed ? 1 : 0.45,
                  }}
                >
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: step.completed ? 'var(--accent-emerald)' : 'var(--text-dim)',
                      marginTop: '6px',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#fff' }}>
                        {step.label}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {step.timestamp}
                      </span>
                    </div>
                    {step.note && (
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                        {step.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Item Highlights & Delivery Destination */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Delivery Destination
              </div>
              <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>
                {order.shippingAddress.street}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Purchased Items ({order.items.length})
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {order.items.map((item, idx) => (
                  <img
                    key={idx}
                    src={item.image}
                    alt={item.productName}
                    title={`${item.productName} (x${item.quantity})`}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      border: '1px solid var(--border-subtle)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={() => setSelectedOrderId(null)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
