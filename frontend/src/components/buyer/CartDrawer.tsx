import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  CheckCircle,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    products,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    setIsCheckoutModalOpen,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; isPercent: boolean } | null>(null);
  const [couponError, setCouponError] = useState('');

  if (!isCartDrawerOpen) return null;

  // Compute cart items with product details
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

  let discount = 0;
  if (appliedCoupon) {
    discount = appliedCoupon.isPercent
      ? (subtotal * appliedCoupon.discount) / 100
      : appliedCoupon.discount;
    discount = Math.min(discount, subtotal);
  }

  const shippingFee = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const estimatedTax = subtotal * 0.08;
  const grandTotal = Math.max(0, subtotal - discount + shippingFee + estimatedTax);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'WELCOME20') {
      setAppliedCoupon({ code, discount: 20, isPercent: false });
    } else if (code === 'SAVE15') {
      setAppliedCoupon({ code, discount: 15, isPercent: true });
    } else {
      setCouponError('Invalid code. Try "WELCOME20" or "SAVE15"');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsCartDrawerOpen(false)} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100vh',
          background: '#0F172A',
          borderLeft: '1px solid var(--border-medium)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideInRight 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.2rem' }}>Shopping Bag</h3>
            <span
              style={{
                fontSize: '0.75rem',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#A5B4FC',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
              }}
            >
              {cartWithProducts.length} items
            </span>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="icon-action-btn"
            style={{ width: '32px', height: '32px' }}
            title="Close Drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body: Cart Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {cartWithProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                }}
              >
                <ShoppingBag size={28} color="var(--text-dim)" />
              </div>
              <h4 style={{ color: '#fff', marginBottom: '8px' }}>Your bag is empty</h4>
              <p style={{ fontSize: '0.85rem', marginBottom: '20px' }}>
                Explore our catalog and add items to your cart!
              </p>
              <button
                className="btn-primary"
                onClick={() => setIsCartDrawerOpen(false)}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartWithProducts.map(({ productId, quantity, product }) => (
                <div
                  key={productId}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '14px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      border: '1px solid var(--border-subtle)',
                    }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '0.9rem', color: '#fff', lineHeight: 1.3, maxWidth: '180px' }}>
                        {product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(productId)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-dim)',
                          cursor: 'pointer',
                          padding: '2px',
                        }}
                        title="Remove Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(15, 23, 42, 0.8)',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                          padding: '2px',
                        }}
                      >
                        <button
                          onClick={() => updateCartQuantity(productId, quantity - 1)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: '18px', textAlign: 'center' }}>
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(productId, quantity + 1)}
                          disabled={quantity >= product.stock}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: quantity >= product.stock ? 0.3 : 1,
                          }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                        ${(product.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-dim)',
                  fontSize: '0.78rem',
                  alignSelf: 'flex-start',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  marginTop: '4px',
                }}
              >
                Clear entire bag
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer: Pricing & Checkout */}
        {cartWithProducts.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              borderTop: '1px solid var(--border-subtle)',
              background: 'rgba(15, 23, 42, 0.95)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {/* Promo Code Entry */}
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  placeholder="Promo Code (WELCOME20)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '32px', fontSize: '0.82rem', padding: '8px 12px 8px 32px' }}
                />
                <Tag
                  size={14}
                  color="var(--text-dim)"
                  style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
              <button type="submit" className="btn-secondary btn-sm" style={{ padding: '8px 14px' }}>
                Apply
              </button>
            </form>

            {appliedCoupon && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#34D399',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                }}
              >
                <CheckCircle size={14} />
                <span>Coupon &quot;{appliedCoupon.code}&quot; applied (-${discount.toFixed(2)})</span>
              </div>
            )}
            {couponError && (
              <div style={{ color: '#F87171', fontSize: '0.76rem' }}>{couponError}</div>
            )}

            {/* Price Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34D399' }}>
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Estimated Shipping</span>
                <span>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Estimated Taxes (8%)</span>
                <span>${estimatedTax.toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '8px',
                  marginTop: '4px',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button className="btn-primary" onClick={handleProceedToCheckout} style={{ width: '100%' }}>
              Proceed to Checkout
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
