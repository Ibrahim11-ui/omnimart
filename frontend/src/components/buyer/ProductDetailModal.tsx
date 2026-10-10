import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingCart,
  Heart,
  Check,
  Store,
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    products,
    selectedProductId,
    setSelectedProductId,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCartDrawerOpen,
  } = useStore();

  const [quantity, setQuantity] = useState(1);

  if (!selectedProductId) return null;

  const product = products.find((p) => p.id === selectedProductId);
  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product.id, quantity);
    setSelectedProductId(null);
    setIsCartDrawerOpen(true);
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedProductId(null)}>
      <div
        className="modal-content"
        style={{ maxWidth: '840px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="status-pill info">{product.category}</span>
            {product.status === 'approved' && (
              <span className="status-pill success">
                <Check size={12} /> Verified Product
              </span>
            )}
          </div>
          <button
            onClick={() => setSelectedProductId(null)}
            className="icon-action-btn"
            style={{ width: '32px', height: '32px' }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            {/* Product Image */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  background: '#1F2937',
                  aspectRatio: '1',
                  position: 'relative',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  className={`wishlist-heart-btn ${inWishlist ? 'active' : ''}`}
                  onClick={() => toggleWishlist(product.id)}
                  title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart size={18} fill={inWishlist ? '#F43F5E' : 'none'} />
                </button>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {product.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.72rem',
                      background: 'rgba(255, 255, 255, 0.06)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Product Details & Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.45rem', marginBottom: '8px' }}>{product.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#FBBF24', gap: '4px', fontSize: '0.88rem' }}>
                    <Star size={16} fill="#FBBF24" />
                    <span style={{ fontWeight: 700, color: '#fff' }}>{product.rating}</span>
                    <span style={{ color: 'var(--text-dim)' }}>({product.reviewCount} customer reviews)</span>
                  </div>
                </div>
              </div>

              {/* Price & Savings */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', padding: '14px 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span style={{ fontSize: '1.1rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', fontSize: '0.8rem', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                {product.description}
              </p>

              {/* Seller attribution */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.82rem',
                }}
              >
                <Store size={16} color="var(--primary)" />
                <span style={{ color: 'var(--text-muted)' }}>Listed by:</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{product.sellerName}</span>
                <span className="status-pill success" style={{ marginLeft: 'auto', padding: '2px 8px', fontSize: '0.7rem' }}>
                  Verified Seller
                </span>
              </div>

              {/* Stock Status Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isOutOfStock ? (
                  <span className="status-pill danger">Out of Stock</span>
                ) : isLowStock ? (
                  <span className="status-pill warning">
                    Only {product.stock} left in stock - order soon!
                  </span>
                ) : (
                  <span className="status-pill success">
                    In Stock ({product.stock} units available)
                  </span>
                )}
              </div>

              {/* Quantity Picker & Add to Cart */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--bg-input)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    padding: '2px 6px',
                  }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      fontSize: '1.1rem',
                      width: '32px',
                      height: '36px',
                      cursor: 'pointer',
                      opacity: quantity <= 1 ? 0.4 : 1,
                    }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 12px', fontWeight: 700, fontSize: '0.95rem' }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      fontSize: '1.1rem',
                      width: '32px',
                      height: '36px',
                      cursor: 'pointer',
                      opacity: quantity >= product.stock ? 0.4 : 1,
                    }}
                  >
                    +
                  </button>
                </div>

                <button
                  className="btn-primary"
                  style={{ flex: 1 }}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>

                <button
                  className="btn-secondary"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  style={{ background: 'rgba(99, 102, 241, 0.2)', borderColor: 'rgba(99, 102, 241, 0.4)' }}
                >
                  Buy Now
                </button>
              </div>

              {/* Platform Guarantees */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  marginTop: '12px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-subtle)',
                  textAlign: 'center',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  <Truck size={16} color="var(--accent-cyan)" />
                  <span>Free Express Delivery over $150</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  <ShieldCheck size={16} color="var(--accent-emerald)" />
                  <span>2-Year Warranty Guaranteed</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  <RotateCcw size={16} color="var(--accent-purple)" />
                  <span>30-Day Hassle-Free Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
