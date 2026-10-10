import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Storefront } from './components/buyer/Storefront';
import { BuyerDashboard } from './components/buyer/BuyerDashboard';
import { ProductDetailModal } from './components/buyer/ProductDetailModal';
import { CartDrawer } from './components/buyer/CartDrawer';
import { CheckoutModal } from './components/buyer/CheckoutModal';
import { OrderTrackerModal } from './components/buyer/OrderTrackerModal';
import { SellerDashboard } from './components/seller/SellerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Toast } from './components/common/Toast';
import { Shield, Sparkles, Store, ShoppingBag } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeRole, buyerTab } = useStore();

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        {/* Active Role Banner / Breadcrumb */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.84rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {activeRole === 'buyer' && <ShoppingBag size={16} color="var(--primary)" />}
            {activeRole === 'seller' && <Store size={16} color="var(--accent-cyan)" />}
            {activeRole === 'admin' && <Shield size={16} color="var(--accent-purple)" />}
            <span style={{ color: 'var(--text-muted)' }}>Current Active Mode:</span>
            <strong style={{ color: '#fff', textTransform: 'uppercase' }}>
              {activeRole === 'buyer'
                ? buyerTab === 'store'
                  ? 'Buyer Storefront (Browsing Catalog)'
                  : `Buyer Dashboard (${buyerTab})`
                : activeRole === 'seller'
                ? 'Seller Management Portal'
                : 'Administrator Global Control Console'}
            </strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
            <span>Reactive State Synced Across Roles</span>
          </div>
        </div>

        {/* View Router */}
        {activeRole === 'buyer' && (
          <>
            {buyerTab === 'store' ? <Storefront /> : <BuyerDashboard />}
          </>
        )}

        {activeRole === 'seller' && <SellerDashboard />}

        {activeRole === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackerModal />
      <Toast />

      {/* Footer with Compliance Notice */}
      <footer className="platform-footer">
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontWeight: 700 }}>
            <Sparkles size={16} color="var(--primary)" />
            <span>OmniMart Multi-Role E-Commerce Platform</span>
          </div>
          <p style={{ maxWidth: '700px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Empowering Buyers with real-time order tracking, Sellers with dynamic inventory & sales analytics, and Administrators with full user & compliance governance.
          </p>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '6px' }}>
            &copy; 2024 GUVI Geek Network Pvt. Ltd. All rights reserved. No part of this document may be reproduced or distributed without prior written permission.
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}

export default App;
