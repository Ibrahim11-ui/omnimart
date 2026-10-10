import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Search,
  Star,
  ShoppingCart,
  Heart,
  Sparkles,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import type { ProductCategory } from '../../types';

const CATEGORIES: ProductCategory[] = [
  'Audio',
  'Workspaces',
  'Wearables',
  'Home & Living',
  'Electronics',
  'Accessories',
];

export const Storefront: React.FC = () => {
  const {
    products,
    setSelectedProductId,
    addToCart,
    toggleWishlist,
    isInWishlist,
    recordProductView,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceMax, setPriceMax] = useState<number>(600);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Only show approved products to buyers
        if (p.status !== 'approved') return false;

        // Search text matching
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = p.name.toLowerCase().includes(q);
          const matchesDesc = p.description.toLowerCase().includes(q);
          const matchesTag = p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchesTitle && !matchesDesc && !matchesTag) return false;
        }

        // Category filter
        if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }

        // Price filter
        if (p.price > priceMax) {
          return false;
        }

        // Stock filter
        if (inStockOnly && p.stock <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // featured default
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, searchQuery, selectedCategory, priceMax, inStockOnly, sortBy]);

  const handleProductClick = (productId: string) => {
    recordProductView(productId);
    setSelectedProductId(productId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero Showcase Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '48px 36px',
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.7) 0%, rgba(15, 23, 42, 0.85) 60%, rgba(6, 78, 59, 0.4) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(99, 102, 241, 0.25)',
              border: '1px solid rgba(99, 102, 241, 0.5)',
              color: '#A5B4FC',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <Sparkles size={14} /> Curated Tech & Lifestyle Marketplace
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', maxWidth: '750px', lineHeight: 1.2 }}>
          Discover Exceptional Hardware & Crafted Everyday Gear.
        </h1>

        <p style={{ color: 'var(--text-muted)', maxWidth: '620px', fontSize: '0.98rem' }}>
          Verified sellers, transparent live order tracking, and an integrated multi-persona workflow designed for seamless commerce.
        </p>

        {/* Promo Code Quick Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Trending Promo:</span>
          <span style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', color: '#fff', border: '1px dashed rgba(255, 255, 255, 0.2)' }}>
            Use <strong>WELCOME20</strong> for $20 off
          </span>
          <span style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', color: '#fff', border: '1px dashed rgba(255, 255, 255, 0.2)' }}>
            Use <strong>SAVE15</strong> for 15% off
          </span>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div
        className="glass-panel"
        style={{
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Search products, keywords, audio, desks, keyboards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '40px' }}
            />
            <Search
              size={18}
              color="var(--text-dim)"
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpDown size={16} color="var(--text-muted)" />
            <select
              aria-label="Sort products"
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{ minWidth: '180px' }}
            >
              <option value="featured">Featured Picks</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Secondary Filter Row: Categories & Sliders */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          {/* Category Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCategory('All')}
              className={`btn-sm ${selectedCategory === 'All' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Price & In-stock Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Max Price:</span>
              <input
                type="range"
                min="50"
                max="600"
                step="25"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                style={{ width: '100px', cursor: 'pointer', accentColor: '#6366F1' }}
              />
              <span style={{ fontWeight: 700, color: '#fff', minWidth: '45px' }}>${priceMax}</span>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                style={{ accentColor: '#6366F1' }}
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Product Catalog Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '1.25rem' }}>
            Available Listings ({filteredProducts.length})
          </h2>
          {selectedCategory !== 'All' && (
            <span className="status-pill info">Category: {selectedCategory}</span>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div
            className="glass-panel"
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Filter size={36} color="var(--text-dim)" />
            <h3>No products found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Try adjusting your search criteria, price range, or category filter.
            </p>
            <button
              className="btn-secondary"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setPriceMax(600);
                setInStockOnly(false);
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => {
              const inWishlist = isInWishlist(product.id);
              const isOutOfStock = product.stock <= 0;
              const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

              return (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="product-thumb-container">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-thumb"
                      loading="lazy"
                    />

                    {/* Wishlist toggle icon */}
                    <button
                      className={`wishlist-heart-btn ${inWishlist ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      <Heart size={16} fill={inWishlist ? '#F43F5E' : 'none'} />
                    </button>

                    {/* Stock Badges */}
                    <div style={{ position: 'absolute', bottom: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                      {isOutOfStock ? (
                        <span className="status-pill danger" style={{ background: 'rgba(239, 68, 68, 0.9)', color: '#fff' }}>
                          Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="status-pill warning" style={{ background: 'rgba(245, 158, 11, 0.9)', color: '#fff' }}>
                          Only {product.stock} left
                        </span>
                      ) : null}
                      {product.featured && (
                        <span className="status-pill info" style={{ background: 'rgba(99, 102, 241, 0.9)', color: '#fff' }}>
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="product-content">
                    <div className="product-category-row">
                      <span>{product.category}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#FBBF24' }}>
                        <Star size={12} fill="#FBBF24" />
                        <span style={{ fontWeight: 600, color: '#fff' }}>{product.rating}</span>
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>({product.reviewCount})</span>
                      </div>
                    </div>

                    <h3 className="product-title">{product.name}</h3>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '10px' }}>
                      <div className="product-pricing">
                        <span className="price-current">${product.price.toFixed(2)}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="price-original">${product.originalPrice.toFixed(2)}</span>
                        )}
                      </div>

                      <button
                        className="btn-primary btn-sm"
                        disabled={isOutOfStock}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product.id, 1);
                        }}
                        title={isOutOfStock ? 'Out of Stock' : 'Add to Bag'}
                      >
                        <ShoppingCart size={14} />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
