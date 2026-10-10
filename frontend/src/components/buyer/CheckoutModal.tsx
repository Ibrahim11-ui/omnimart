import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  CreditCard,
  MapPin,
  CheckCircle2,
  Package,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import type { Order } from '../../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    cart,
    products,
    currentUser,
    placeOrder,
    setBuyerTab,
    setSelectedOrderId,
  } = useStore();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    currentUser.addresses[0]?.id || 'custom'
  );

  const customAddress = {
    street: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    zipCode: '97477',
  };

  const [selectedCardId, setSelectedCardId] = useState<string>(
    currentUser.paymentCards[0]?.id || 'custom'
  );

  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutModalOpen) return null;

  // Cart summary
  const cartWithProducts = cart
    .map((item) => {
      const prod = products.find((p) => p.id === item.productId);
      return prod ? { ...item, product: prod } : null;
    })
    .filter(Boolean) as { productId: string; quantity: number; product: any }[];

  const subtotal = cartWithProducts.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = subtotal > 150 ? 0 : 15;
  const estimatedTax = subtotal * 0.08;
  const totalAmount = subtotal + shippingFee + estimatedTax;

  const handlePlaceOrder = () => {
    setIsSubmitting(true);

    const chosenAddress =
      currentUser.addresses.find((a) => a.id === selectedAddressId) || {
        id: `addr-${Date.now()}`,
        label: 'Custom Address',
        street: customAddress.street,
        city: customAddress.city,
        state: customAddress.state,
        zipCode: customAddress.zipCode,
        country: 'United States',
        isDefault: false,
      };

    const chosenCard =
      currentUser.paymentCards.find((c) => c.id === selectedCardId) || {
        id: `card-${Date.now()}`,
        cardType: 'Visa' as const,
        lastFour: '8910',
        holderName: currentUser.name,
        expiry: '11/28',
        isDefault: false,
      };

    setTimeout(() => {
      const newOrder = placeOrder({
        buyerId: currentUser.id,
        items: cart.map((c) => ({ productId: c.productId, quantity: c.quantity })),
        shippingAddress: chosenAddress,
        paymentCard: chosenCard,
        discountAmount: 0,
      });

      setIsSubmitting(false);
      if (newOrder) {
        setConfirmedOrder(newOrder);
      }
    }, 600);
  };

  const handleTrackNewOrder = () => {
    if (confirmedOrder) {
      setSelectedOrderId(confirmedOrder.id);
      setBuyerTab('orders');
    }
    setIsCheckoutModalOpen(false);
    setConfirmedOrder(null);
  };

  return (
    <div className="modal-overlay" onClick={() => !isSubmitting && setIsCheckoutModalOpen(false)}>
      <div
        className="modal-content"
        style={{ maxWidth: '680px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* If order is confirmed, show celebratory order confirmation screen */}
        {confirmedOrder ? (
          <div style={{ padding: '36px 32px', textAlign: 'center' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid #10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                color: '#10B981',
              }}
            >
              <CheckCircle2 size={40} />
            </div>

            <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', marginBottom: '8px' }}>
              Order Confirmed!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
              Thank you for your purchase, {currentUser.name}. Your order has been placed successfully and the seller has been notified.
            </p>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                padding: '18px 24px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '28px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Order Reference:</span>
                <span style={{ fontWeight: 700, color: '#A5B4FC' }}>{confirmedOrder.orderNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tracking Number:</span>
                <span style={{ fontWeight: 600, color: '#FFFFFF' }}>{confirmedOrder.trackingNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Delivery:</span>
                <span style={{ fontWeight: 600, color: '#34D399' }}>{confirmedOrder.estimatedDelivery}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Charged:</span>
                <span style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1.05rem' }}>
                  ${confirmedOrder.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                className="btn-primary"
                onClick={handleTrackNewOrder}
              >
                <Package size={16} />
                Track Order Status
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setIsCheckoutModalOpen(false);
                  setConfirmedOrder(null);
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.2rem' }}>Secure Checkout</h3>
              </div>
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="icon-action-btn"
                style={{ width: '32px', height: '32px' }}
                title="Cancel Checkout"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {/* Step 1: Shipping Address */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <MapPin size={18} color="var(--accent-cyan)" />
                  <h4 style={{ fontSize: '0.95rem' }}>1. Delivery Address</h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {currentUser.addresses.map((addr) => (
                    <label
                      key={addr.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '12px 16px',
                        background:
                          selectedAddressId === addr.id
                            ? 'rgba(99, 102, 241, 0.12)'
                            : 'rgba(255, 255, 255, 0.02)',
                        border: `1px solid ${
                          selectedAddressId === addr.id
                            ? 'var(--primary)'
                            : 'var(--border-subtle)'
                        }`,
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="radio"
                        name="shippingAddress"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        style={{ marginTop: '3px' }}
                      />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>
                            {addr.label}
                          </span>
                          {addr.isDefault && (
                            <span className="status-pill info" style={{ padding: '1px 6px', fontSize: '0.68rem' }}>
                              Default
                            </span>
                          )}
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '2px' }}>
                          {addr.street}, {addr.city}, {addr.state} {addr.zipCode}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <CreditCard size={18} color="var(--accent-emerald)" />
                  <h4 style={{ fontSize: '0.95rem' }}>2. Payment Method</h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {currentUser.paymentCards.length > 0 ? (
                    currentUser.paymentCards.map((card) => (
                      <label
                        key={card.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          background:
                            selectedCardId === card.id
                              ? 'rgba(99, 102, 241, 0.12)'
                              : 'rgba(255, 255, 255, 0.02)',
                          border: `1px solid ${
                            selectedCardId === card.id
                              ? 'var(--primary)'
                              : 'var(--border-subtle)'
                          }`,
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={selectedCardId === card.id}
                          onChange={() => setSelectedCardId(card.id)}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: 700, color: '#A5B4FC', fontSize: '0.85rem' }}>
                            {card.cardType} •••• {card.lastFour}
                          </span>
                          <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                            Expires {card.expiry}
                          </span>
                        </div>
                      </label>
                    ))
                  ) : (
                    <div
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <CreditCard size={16} />
                      <span>Instant Secure Card Simulation (Visa ****4242)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: Order Items Summary */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Items ({cartWithProducts.length})</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Express Shipping</span>
                  <span>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Estimated Tax</span>
                  <span>${estimatedTax.toFixed(2)}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '8px',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    color: '#fff',
                  }}
                >
                  <span>Total Amount</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setIsCheckoutModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handlePlaceOrder}
                disabled={isSubmitting || cartWithProducts.length === 0}
              >
                {isSubmitting ? 'Authorizing Payment...' : `Confirm & Pay $${totalAmount.toFixed(2)}`}
                {!isSubmitting && <ArrowRight size={16} />}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
