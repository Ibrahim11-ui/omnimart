import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Clock,
  Package,
  Heart,
  User,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  MapPin,
  CreditCard,
  Plus,
  TrendingDown,
} from 'lucide-react';
import type { Address, PaymentCard } from '../../types';

export const BuyerDashboard: React.FC = () => {
  const {
    buyerTab,
    setBuyerTab,
    browsingHistory,
    wishlist,
    products,
    orders,
    currentUser,
    updateUser,
    addToCart,
    toggleWishlist,
    setSelectedProductId,
    setSelectedOrderId,
    showToast,
  } = useStore();

  // Account details form state
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileEmail, setProfileEmail] = useState(currentUser.email);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone || '');

  // New address state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Apartment',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });

  // New card state
  const [showCardForm, setShowCardForm] = useState(false);
  const [newCard, setNewCard] = useState<{
    cardType: 'Visa' | 'Mastercard' | 'Amex';
    lastFour: string;
    holderName: string;
    expiry: string;
  }>({
    cardType: 'Visa',
    lastFour: '',
    holderName: currentUser.name,
    expiry: '12/28',
  });

  // Buyer orders only
  const myOrders = orders.filter((o) => o.buyerId === currentUser.id);

  // Handle saving profile changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(currentUser.id, {
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
    });
    showToast('Profile information successfully saved!', 'success');
  };

  // Handle adding new address
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city) return;

    const addressObj: Address = {
      id: `addr-${Date.now()}`,
      label: newAddress.label,
      street: newAddress.street,
      city: newAddress.city,
      state: newAddress.state,
      zipCode: newAddress.zipCode,
      country: 'United States',
      isDefault: currentUser.addresses.length === 0,
    };

    updateUser(currentUser.id, {
      addresses: [...currentUser.addresses, addressObj],
    });

    setNewAddress({ label: 'Apartment', street: '', city: '', state: '', zipCode: '' });
    setShowAddressForm(false);
    showToast('New shipping address added to address book!', 'success');
  };

  const handleDeleteAddress = (addressId: string) => {
    updateUser(currentUser.id, {
      addresses: currentUser.addresses.filter((a) => a.id !== addressId),
    });
    showToast('Address removed from address book.', 'info');
  };

  // Handle adding new card
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCard.lastFour || newCard.lastFour.length !== 4) {
      showToast('Please enter a valid 4-digit card ending.', 'error');
      return;
    }

    const cardObj: PaymentCard = {
      id: `card-${Date.now()}`,
      cardType: newCard.cardType,
      lastFour: newCard.lastFour,
      holderName: newCard.holderName,
      expiry: newCard.expiry,
      isDefault: currentUser.paymentCards.length === 0,
    };

    updateUser(currentUser.id, {
      paymentCards: [...currentUser.paymentCards, cardObj],
    });

    setNewCard({ cardType: 'Visa', lastFour: '', holderName: currentUser.name, expiry: '12/28' });
    setShowCardForm(false);
    showToast('New payment card added successfully!', 'success');
  };

  const handleDeleteCard = (cardId: string) => {
    updateUser(currentUser.id, {
      paymentCards: currentUser.paymentCards.filter((c) => c.id !== cardId),
    });
    showToast('Payment card removed.', 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Dashboard Subnav Tabs */}
      <div className="subnav-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={buyerTab === 'store'}
          className={`subnav-tab-btn ${buyerTab === 'store' ? 'active' : ''}`}
          onClick={() => setBuyerTab('store')}
        >
          <ShoppingBag size={16} />
          Explore Storefront
        </button>

        <button
          role="tab"
          aria-selected={buyerTab === 'history'}
          className={`subnav-tab-btn ${buyerTab === 'history' ? 'active' : ''}`}
          onClick={() => setBuyerTab('history')}
        >
          <Clock size={16} />
          Browsing History ({browsingHistory.length})
        </button>

        <button
          role="tab"
          aria-selected={buyerTab === 'orders'}
          className={`subnav-tab-btn ${buyerTab === 'orders' ? 'active' : ''}`}
          onClick={() => setBuyerTab('orders')}
        >
          <Package size={16} />
          Order History & Tracking ({myOrders.length})
        </button>

        <button
          role="tab"
          aria-selected={buyerTab === 'wishlist'}
          className={`subnav-tab-btn ${buyerTab === 'wishlist' ? 'active' : ''}`}
          onClick={() => setBuyerTab('wishlist')}
        >
          <Heart size={16} />
          Wishlist ({wishlist.length})
        </button>

        <button
          role="tab"
          aria-selected={buyerTab === 'account'}
          className={`subnav-tab-btn ${buyerTab === 'account' ? 'active' : ''}`}
          onClick={() => setBuyerTab('account')}
        >
          <User size={16} />
          Account Overview
        </button>
      </div>

      {/* 1. PRODUCT BROWSING HISTORY */}
      {buyerTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem' }}>Recently Viewed Products</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Revisit products you recently checked out or add them directly to your bag.
              </p>
            </div>
          </div>

          {browsingHistory.length === 0 ? (
            <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Clock size={36} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
              <h3>No browsing history recorded yet</h3>
              <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>
                Click on any product in the store to view details and it will appear here.
              </p>
            </div>
          ) : (
            <div className="product-grid">
              {browsingHistory.map((item) => {
                const prod = products.find((p) => p.id === item.productId);
                if (!prod) return null;

                return (
                  <div
                    key={item.productId}
                    className="product-card"
                    onClick={() => setSelectedProductId(prod.id)}
                  >
                    <div className="product-thumb-container">
                      <img src={prod.image} alt={prod.name} className="product-thumb" />
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '10px',
                          left: '10px',
                          background: 'rgba(15, 23, 42, 0.85)',
                          backdropFilter: 'blur(6px)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          color: '#A5B4FC',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        Viewed {item.viewedAt}
                      </span>
                    </div>

                    <div className="product-content">
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{prod.category}</span>
                      <h3 className="product-title">{prod.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '8px' }}>
                        <span className="price-current">${prod.price.toFixed(2)}</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            className="btn-secondary btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProductId(prod.id);
                            }}
                          >
                            Revisit
                          </button>
                          <button
                            className="btn-primary btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(prod.id, 1);
                            }}
                          >
                            <ShoppingCart size={13} /> Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. ORDER HISTORY & LIVE TRACKING */}
      {buyerTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem' }}>My Orders & Tracking</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Review your purchase history and track active shipments in real time.
            </p>
          </div>

          {myOrders.length === 0 ? (
            <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Package size={36} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
              <h3>No orders found</h3>
              <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>
                When you make a purchase from the storefront, your orders and tracking milestones appear here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {myOrders.map((order) => {
                let statusColor = 'info';
                if (order.status === 'delivered') statusColor = 'success';
                else if (order.status === 'cancelled') statusColor = 'danger';
                else if (order.status === 'shipped' || order.status === 'out_for_delivery') statusColor = 'warning';

                return (
                  <div
                    key={order.id}
                    className="glass-panel"
                    style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
                  >
                    {/* Header info */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ORDER NUMBER</div>
                          <div style={{ fontWeight: 700, color: '#A5B4FC', fontSize: '1.05rem' }}>
                            {order.orderNumber}
                          </div>
                        </div>
                        <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DATE PLACED</div>
                          <div style={{ fontSize: '0.88rem', color: '#fff' }}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL CHARGED</div>
                          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                            ${order.totalAmount.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className={`status-pill ${statusColor}`}>
                          <span className="status-dot" />
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <button
                          className="btn-primary btn-sm"
                          onClick={() => setSelectedOrderId(order.id)}
                        >
                          <Package size={14} />
                          Live Tracking
                        </button>
                      </div>
                    </div>

                    {/* Order Items Row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        paddingTop: '14px',
                        borderTop: '1px solid var(--border-subtle)',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ position: 'relative' }}>
                            <img
                              src={item.image}
                              alt={item.productName}
                              style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
                            />
                            {item.quantity > 1 && (
                              <span
                                style={{
                                  position: 'absolute',
                                  top: '-6px',
                                  right: '-6px',
                                  background: '#6366F1',
                                  color: '#fff',
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  width: '18px',
                                  height: '18px',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {item.quantity}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>
                          {order.items.map((i) => i.productName).join(', ')}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Delivering to: {order.shippingAddress.street}, {order.shippingAddress.city}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', fontSize: '0.82rem', color: '#34D399' }}>
                        Est. Delivery: {order.estimatedDelivery}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. WISHLIST WITH PRICE DROP TRACKING */}
      {buyerTab === 'wishlist' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem' }}>Saved Wishlist</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Keep track of items you love. We automatically alert you if a seller discounts their price!
            </p>
          </div>

          {wishlist.length === 0 ? (
            <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Heart size={36} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
              <h3>Your wishlist is empty</h3>
              <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>
                Click the heart icon on any product in the catalog to save it here for later.
              </p>
            </div>
          ) : (
            <div className="product-grid">
              {wishlist.map((item) => {
                const prod = products.find((p) => p.id === item.productId);
                if (!prod) return null;

                const hasPriceDrop = prod.price < item.priceWhenAdded;
                const savings = item.priceWhenAdded - prod.price;

                return (
                  <div key={item.productId} className="product-card">
                    <div className="product-thumb-container">
                      <img src={prod.image} alt={prod.name} className="product-thumb" />
                      <button
                        className="wishlist-heart-btn active"
                        onClick={() => toggleWishlist(prod.id)}
                        title="Remove from Wishlist"
                      >
                        <Heart size={16} fill="#F43F5E" />
                      </button>

                      {hasPriceDrop && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '10px',
                            left: '10px',
                            background: 'rgba(16, 185, 129, 0.95)',
                            color: '#fff',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <TrendingDown size={14} /> Price Drop: Save ${savings.toFixed(2)}
                        </div>
                      )}
                    </div>

                    <div className="product-content">
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{prod.category}</span>
                      <h3 className="product-title">{prod.name}</h3>

                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span className="price-current">${prod.price.toFixed(2)}</span>
                        {hasPriceDrop && (
                          <span className="price-original">${item.priceWhenAdded.toFixed(2)}</span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '10px' }}>
                        <button
                          className="btn-primary btn-sm"
                          style={{ flex: 1 }}
                          onClick={() => {
                            addToCart(prod.id, 1);
                            toggleWishlist(prod.id);
                          }}
                        >
                          <ShoppingCart size={14} />
                          Move to Bag
                        </button>
                        <button
                          className="btn-danger btn-sm"
                          onClick={() => toggleWishlist(prod.id)}
                          title="Remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. ACCOUNT OVERVIEW (PERSONAL DETAILS, ADDRESS BOOK, PAYMENT METHODS) */}
      {buyerTab === 'account' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Personal Details Form */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <User size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.15rem' }}>Personal Profile</h3>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Account Role</label>
                <input
                  type="text"
                  className="form-input"
                  value="Verified Buyer"
                  disabled
                  style={{ opacity: 0.6 }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '6px' }}>
                Save Profile Changes
              </button>
            </form>
          </div>

          {/* Address Book */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={20} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '1.15rem' }}>Address Book</h3>
              </div>
              <button
                className="btn-secondary btn-sm"
                onClick={() => setShowAddressForm(!showAddressForm)}
              >
                <Plus size={14} />
                {showAddressForm ? 'Cancel' : 'Add New'}
              </button>
            </div>

            {/* Address Add Form */}
            {showAddressForm && (
              <form
                onSubmit={handleAddAddress}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '16px',
                }}
              >
                <div className="form-group">
                  <label className="form-label">Address Label</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newAddress.label}
                    onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                    placeholder="e.g. Home, Office, Vacation Home"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    placeholder="123 Main St Apt 4"
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Zip</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newAddress.zipCode}
                      onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary btn-sm" style={{ width: '100%' }}>
                  Save Address
                </button>
              </form>
            )}

            {/* List of saved addresses */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentUser.addresses.map((addr) => (
                <div
                  key={addr.id}
                  style={{
                    padding: '12px 14px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>{addr.label}</span>
                      {addr.isDefault && <span className="status-pill info" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>Default</span>}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>
                      {addr.street}, {addr.city}, {addr.state} {addr.zipCode}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '2px' }}
                    title="Delete Address"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Payment Methods */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CreditCard size={20} color="var(--accent-emerald)" />
                <h3 style={{ fontSize: '1.15rem' }}>Payment Methods</h3>
              </div>
              <button
                className="btn-secondary btn-sm"
                onClick={() => setShowCardForm(!showCardForm)}
              >
                <Plus size={14} />
                {showCardForm ? 'Cancel' : 'Add Card'}
              </button>
            </div>

            {/* New card add form */}
            {showCardForm && (
              <form
                onSubmit={handleAddCard}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '16px',
                }}
              >
                <div className="form-group">
                  <label className="form-label">Card Brand</label>
                  <select
                    className="form-select"
                    value={newCard.cardType}
                    onChange={(e) => setNewCard({ ...newCard, cardType: e.target.value as any })}
                  >
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="Amex">American Express</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Last 4 Digits</label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="e.g. 5521"
                    className="form-input"
                    value={newCard.lastFour}
                    onChange={(e) => setNewCard({ ...newCard, lastFour: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div className="form-group">
                    <label className="form-label">Cardholder Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newCard.holderName}
                      onChange={(e) => setNewCard({ ...newCard, holderName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      placeholder="09/28"
                      className="form-input"
                      value={newCard.expiry}
                      onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary btn-sm" style={{ width: '100%' }}>
                  Save Payment Card
                </button>
              </form>
            )}

            {/* Saved Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentUser.paymentCards.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No payment cards saved.</p>
              ) : (
                currentUser.paymentCards.map((card) => (
                  <div
                    key={card.id}
                    style={{
                      padding: '12px 14px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '24px',
                          borderRadius: '4px',
                          background: '#374151',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.68rem',
                          color: '#fff',
                        }}
                      >
                        {card.cardType}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>
                          •••• •••• •••• {card.lastFour}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          Exp: {card.expiry} • {card.holderName}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '2px' }}
                      title="Remove Card"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
