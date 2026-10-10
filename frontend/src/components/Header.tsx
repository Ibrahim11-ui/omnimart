import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  ShoppingCart,
  Heart,
  Shield,
  Store,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import type { ActiveRoleView } from '../types';

export const Header: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    currentUser,
    users,
    switchUser,
    cartCount,
    wishlist,
    setIsCartDrawerOpen,
    resetToSeedData,
    setBuyerTab,
  } = useStore();

  const handleRoleChange = (role: ActiveRoleView) => {
    setActiveRole(role);
    if (role === 'buyer') {
      setBuyerTab('store');
    }
  };

  return (
    <header className="header-bar">
      <div className="header-inner">
        {/* Brand Logo */}
        <div
          className="brand-logo"
          onClick={() => {
            setActiveRole('buyer');
            setBuyerTab('store');
          }}
          title="Return to Storefront"
        >
          <div className="brand-icon-box">
            <Sparkles size={20} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="brand-text">OmniMart</span>
            <span className="brand-badge">Multi-Role</span>
          </div>
        </div>

        {/* Unified Role Switcher Pills */}
        <div className="role-nav-switch" role="tablist" aria-label="Role View Selector">
          <button
            role="tab"
            aria-selected={activeRole === 'buyer'}
            className={`role-pill-btn ${activeRole === 'buyer' ? 'active' : ''}`}
            onClick={() => handleRoleChange('buyer')}
            title="Browse products, track orders & view account as Buyer"
          >
            <ShoppingBag size={16} />
            <span>Buyer View</span>
          </button>

          <button
            role="tab"
            aria-selected={activeRole === 'seller'}
            className={`role-pill-btn seller ${activeRole === 'seller' ? 'active' : ''}`}
            onClick={() => handleRoleChange('seller')}
            title="Manage listings, inventory & fulfill orders as Seller"
          >
            <Store size={16} />
            <span>Seller Portal</span>
          </button>

          <button
            role="tab"
            aria-selected={activeRole === 'admin'}
            className={`role-pill-btn admin ${activeRole === 'admin' ? 'active' : ''}`}
            onClick={() => handleRoleChange('admin')}
            title="Manage users, products, orders & activity logs as Admin"
          >
            <Shield size={16} />
            <span>Admin Console</span>
          </button>
        </div>

        {/* Right Side Tools & Current Persona */}
        <div className="header-actions">
          {/* Persona Switcher */}
          <div className="persona-select-box">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="persona-avatar"
            />
            <div className="persona-info">
              <span className="persona-name">{currentUser.name}</span>
              <select
                aria-label="Switch User Persona"
                className="user-switch-select"
                value={currentUser.id}
                onChange={(e) => switchUser(e.target.value)}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id} style={{ background: '#111827', color: '#fff' }}>
                    {u.name} ({u.role.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Buyer Specific Quick Actions */}
          {activeRole === 'buyer' && (
            <>
              <button
                className="icon-action-btn"
                onClick={() => setBuyerTab('wishlist')}
                title="View Wishlist"
              >
                <Heart size={18} />
                {wishlist.length > 0 && (
                  <span className="badge-count" style={{ background: '#F43F5E' }}>
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                className="icon-action-btn"
                onClick={() => setIsCartDrawerOpen(true)}
                title="View Cart"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
              </button>
            </>
          )}

          {/* Quick Demo Data Reset */}
          <button
            className="icon-action-btn"
            onClick={resetToSeedData}
            title="Reset platform to demo seed data"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
