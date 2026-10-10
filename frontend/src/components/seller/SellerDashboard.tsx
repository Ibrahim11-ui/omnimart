import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Package,
  ShoppingBag,
  AlertTriangle,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Truck,
  DollarSign,
  ArrowUpRight,
  RefreshCw,
  X,
  Layers,
} from 'lucide-react';
import type { Product, ProductCategory } from '../../types';

export const SellerDashboard: React.FC = () => {
  const {
    sellerTab,
    setSellerTab,
    products,
    orders,
    currentUser,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    updateOrderStatus,
    showToast,
  } = useStore();

  // Filter products by current seller
  const sellerProducts = products.filter((p) => p.sellerId === currentUser.id);

  // Filter orders containing items from current seller
  const sellerOrders = orders.filter((o) =>
    o.items.some((item) => item.sellerId === currentUser.id)
  );

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state for creating product
  const [productForm, setProductForm] = useState<{
    name: string;
    description: string;
    category: ProductCategory;
    price: number;
    originalPrice: number;
    stock: number;
    lowStockThreshold: number;
    image: string;
    tags: string;
  }>({
    name: '',
    description: '',
    category: 'Electronics',
    price: 99.0,
    originalPrice: 120.0,
    stock: 20,
    lowStockThreshold: 8,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
    tags: 'Smart, New, Hardware',
  });

  // Calculate metrics for Sales Performance
  const totalRevenue = sellerOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, order) => {
      const sellerItemsTotal = order.items
        .filter((i) => i.sellerId === currentUser.id)
        .reduce((sub, item) => sub + item.price * item.quantity, 0);
      return sum + sellerItemsTotal;
    }, 0);

  const totalUnitsSold = sellerOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, order) => {
      return (
        sum +
        order.items
          .filter((i) => i.sellerId === currentUser.id)
          .reduce((sub, item) => sub + item.quantity, 0)
      );
    }, 0);

  const averageOrderValue =
    sellerOrders.length > 0 ? totalRevenue / sellerOrders.length : 0;

  // Inventory analysis
  const lowStockItems = sellerProducts.filter(
    (p) => p.stock <= p.lowStockThreshold && p.stock > 0
  );
  const outOfStockItems = sellerProducts.filter((p) => p.stock <= 0);
  const healthyStockItems = sellerProducts.filter(
    (p) => p.stock > p.lowStockThreshold
  );

  // Handlers
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.description) return;

    addProduct({
      name: productForm.name,
      description: productForm.description,
      category: productForm.category,
      price: Number(productForm.price),
      originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
      stock: Number(productForm.stock),
      lowStockThreshold: Number(productForm.lowStockThreshold),
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      image: productForm.image,
      tags: productForm.tags.split(',').map((t) => t.trim()),
      status: 'approved',
      featured: false,
    });

    setIsAddModalOpen(false);
    setProductForm({
      name: '',
      description: '',
      category: 'Electronics',
      price: 99.0,
      originalPrice: 120.0,
      stock: 20,
      lowStockThreshold: 8,
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
      tags: 'Smart, New, Hardware',
    });
  };

  const handleUpdateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      description: editingProduct.description,
      category: editingProduct.category,
      price: Number(editingProduct.price),
      originalPrice: editingProduct.originalPrice ? Number(editingProduct.originalPrice) : undefined,
      stock: Number(editingProduct.stock),
      lowStockThreshold: Number(editingProduct.lowStockThreshold),
      image: editingProduct.image,
    });

    setEditingProduct(null);
  };

  const handleQuickRestock = (productId: string, amount = 25) => {
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      updateProductStock(productId, prod.stock + amount);
      showToast(`Restocked "${prod.name}" by +${amount} units!`, 'success');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Seller Subnav Tabs */}
      <div className="subnav-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={sellerTab === 'listings'}
          className={`subnav-tab-btn ${sellerTab === 'listings' ? 'active' : ''}`}
          onClick={() => setSellerTab('listings')}
        >
          <Layers size={16} />
          Product Listings ({sellerProducts.length})
        </button>

        <button
          role="tab"
          aria-selected={sellerTab === 'orders'}
          className={`subnav-tab-btn ${sellerTab === 'orders' ? 'active' : ''}`}
          onClick={() => setSellerTab('orders')}
        >
          <ShoppingBag size={16} />
          Customer Orders ({sellerOrders.length})
        </button>

        <button
          role="tab"
          aria-selected={sellerTab === 'inventory'}
          className={`subnav-tab-btn ${sellerTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setSellerTab('inventory')}
        >
          <AlertTriangle size={16} />
          Inventory Overview & Alerts
          {lowStockItems.length > 0 && (
            <span className="badge-count" style={{ position: 'relative', top: 'auto', right: 'auto', marginLeft: '4px' }}>
              {lowStockItems.length}
            </span>
          )}
        </button>

        <button
          role="tab"
          aria-selected={sellerTab === 'performance'}
          className={`subnav-tab-btn ${sellerTab === 'performance' ? 'active' : ''}`}
          onClick={() => setSellerTab('performance')}
        >
          <TrendingUp size={16} />
          Sales Performance & Trends
        </button>
      </div>

      {/* 1. PRODUCT LISTINGS */}
      {sellerTab === 'listings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem' }}>Seller Catalog & Listings</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Create new products, edit pricing and descriptions, and adjust inventory levels in real-time.
              </p>
            </div>
            <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={16} />
              Create New Listing
            </button>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Level</th>
                  <th>Compliance</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellerProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                      No products listed yet. Click &quot;Create New Listing&quot; to add your first product.
                    </td>
                  </tr>
                ) : (
                  sellerProducts.map((p) => {
                    const isLow = p.stock <= p.lowStockThreshold && p.stock > 0;
                    const isOut = p.stock <= 0;

                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img
                              src={p.image}
                              alt={p.name}
                              style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>{p.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ID: {p.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="status-pill info" style={{ fontSize: '0.72rem' }}>{p.category}</span>
                        </td>
                        <td style={{ fontWeight: 700, color: '#fff' }}>
                          ${p.price.toFixed(2)}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              className={`status-pill ${
                                isOut ? 'danger' : isLow ? 'warning' : 'success'
                              }`}
                              style={{ fontSize: '0.74rem' }}
                            >
                              {p.stock} units
                            </span>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button
                                className="icon-action-btn"
                                style={{ width: '24px', height: '24px', fontSize: '0.8rem' }}
                                onClick={() => updateProductStock(p.id, Math.max(0, p.stock - 1))}
                                title="Decrease stock"
                              >
                                -
                              </button>
                              <button
                                className="icon-action-btn"
                                style={{ width: '24px', height: '24px', fontSize: '0.8rem' }}
                                onClick={() => updateProductStock(p.id, p.stock + 1)}
                                title="Increase stock"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`status-pill ${
                              p.status === 'approved'
                                ? 'success'
                                : p.status === 'flagged'
                                ? 'danger'
                                : 'warning'
                            }`}
                            style={{ fontSize: '0.72rem' }}
                          >
                            {p.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              className="btn-secondary btn-sm"
                              onClick={() => setEditingProduct(p)}
                              title="Edit Listing"
                            >
                              <Edit2 size={13} />
                              Edit
                            </button>
                            <button
                              className="btn-danger btn-sm"
                              onClick={() => deleteProduct(p.id)}
                              title="Delete Listing"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. ORDER PROCESSING & MANAGEMENT */}
      {sellerTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem' }}>Fulfillment & Customer Orders</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Manage orders containing your items. Advancing order status automatically updates the buyer&apos;s live tracking.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sellerOrders.length === 0 ? (
              <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Package size={36} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
                <h3>No customer orders yet</h3>
                <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>
                  Orders placed by buyers for your products will appear here for processing and dispatch.
                </p>
              </div>
            ) : (
              sellerOrders.map((order) => {
                const sellerItems = order.items.filter((i) => i.sellerId === currentUser.id);

                return (
                  <div
                    key={order.id}
                    className="glass-panel"
                    style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>ORDER NUMBER</div>
                          <div style={{ fontWeight: 700, color: '#A5B4FC', fontSize: '1.05rem' }}>
                            {order.orderNumber}
                          </div>
                        </div>
                        <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />
                        <div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>CUSTOMER</div>
                          <div style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>
                            {order.buyerName}
                          </div>
                        </div>
                        <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />
                        <div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>STATUS</div>
                          <span
                            className={`status-pill ${
                              order.status === 'delivered'
                                ? 'success'
                                : order.status === 'cancelled'
                                ? 'danger'
                                : 'warning'
                            }`}
                            style={{ fontSize: '0.72rem' }}
                          >
                            {order.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Status Pipeline Advancement Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {order.status === 'pending' && (
                          <button
                            className="btn-primary btn-sm"
                            onClick={() =>
                              updateOrderStatus(order.id, 'processing', 'Packed & checked at warehouse')
                            }
                          >
                            <Package size={14} /> Mark Packed & Ready
                          </button>
                        )}

                        {order.status === 'processing' && (
                          <button
                            className="btn-primary btn-sm"
                            onClick={() =>
                              updateOrderStatus(order.id, 'shipped', 'Dispatched to carrier hub')
                            }
                          >
                            <Truck size={14} /> Dispatch & Mark Shipped
                          </button>
                        )}

                        {order.status === 'shipped' && (
                          <button
                            className="btn-secondary btn-sm"
                            onClick={() =>
                              updateOrderStatus(order.id, 'out_for_delivery', 'Out for final courier delivery')
                            }
                          >
                            Mark Out for Delivery
                          </button>
                        )}

                        {order.status === 'out_for_delivery' && (
                          <button
                            className="btn-primary btn-sm"
                            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                            onClick={() =>
                              updateOrderStatus(order.id, 'delivered', 'Delivered safely to buyer address')
                            }
                          >
                            <CheckCircle size={14} /> Mark Delivered
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Items from this seller */}
                    <div
                      style={{
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {sellerItems.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img
                              src={item.image}
                              alt={item.productName}
                              style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontSize: '0.84rem', color: '#fff', fontWeight: 600 }}>
                                {item.productName}
                              </div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                Qty: {item.quantity} • ${item.price.toFixed(2)} each
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        Ship to: {order.shippingAddress.street}, {order.shippingAddress.city} {order.shippingAddress.zipCode}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 3. INVENTORY OVERVIEW & LOW-STOCK ALERTS */}
      {sellerTab === 'inventory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem' }}>Inventory Overview & Stock Health</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Graphical representations of inventory levels, low-stock threshold triggers, and 1-click restock operations.
            </p>
          </div>

          {/* Graphical Stock Status Bar */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '14px' }}>Warehouse Stock Distribution</h3>
            <div style={{ display: 'flex', height: '14px', borderRadius: '7px', overflow: 'hidden', background: '#1F2937', marginBottom: '16px' }}>
              <div
                style={{
                  width: `${(healthyStockItems.length / Math.max(1, sellerProducts.length)) * 100}%`,
                  background: '#10B981',
                  transition: 'width 0.4s ease',
                }}
                title={`Healthy Stock: ${healthyStockItems.length} items`}
              />
              <div
                style={{
                  width: `${(lowStockItems.length / Math.max(1, sellerProducts.length)) * 100}%`,
                  background: '#F59E0B',
                  transition: 'width 0.4s ease',
                }}
                title={`Low Stock: ${lowStockItems.length} items`}
              />
              <div
                style={{
                  width: `${(outOfStockItems.length / Math.max(1, sellerProducts.length)) * 100}%`,
                  background: '#EF4444',
                  transition: 'width 0.4s ease',
                }}
                title={`Out of Stock: ${outOfStockItems.length} items`}
              />
            </div>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
                <span>Healthy Stock: <strong>{healthyStockItems.length}</strong> items</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
                <span>Low Stock Alert: <strong>{lowStockItems.length}</strong> items</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
                <span>Out of Stock: <strong>{outOfStockItems.length}</strong> items</span>
              </div>
            </div>
          </div>

          {/* Low Stock Alerts Section */}
          {lowStockItems.length > 0 && (
            <div
              className="glass-panel"
              style={{
                padding: '24px',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                background: 'rgba(245, 158, 11, 0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <AlertTriangle size={20} color="#F59E0B" />
                <h3 style={{ fontSize: '1.1rem', color: '#FBBF24' }}>
                  Critical Low Stock Alerts ({lowStockItems.length} Items Below Threshold)
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {lowStockItems.map((prod) => (
                  <div
                    key={prod.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={prod.image}
                        alt={prod.name}
                        style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>{prod.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#F87171' }}>
                          Current Stock: {prod.stock} units (Threshold: {prod.lowStockThreshold})
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn-primary btn-sm"
                      style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}
                      onClick={() => handleQuickRestock(prod.id, 25)}
                    >
                      <RefreshCw size={13} /> Quick Restock (+25)
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Inventory Breakdown */}
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Stock vs Threshold</th>
                  <th>Status Level</th>
                  <th style={{ textAlign: 'right' }}>1-Click Restock</th>
                </tr>
              </thead>
              <tbody>
                {sellerProducts.map((p) => {
                  const maxDisplayStock = 50;
                  const percent = Math.min(100, (p.stock / maxDisplayStock) * 100);
                  const isCrit = p.stock <= p.lowStockThreshold;

                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={p.image}
                            alt={p.name}
                            style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }}
                          />
                          <span style={{ fontWeight: 600, color: '#fff' }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ minWidth: '200px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ flex: 1, height: '8px', background: '#1F2937', borderRadius: '4px', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${percent}%`,
                                height: '100%',
                                background: isCrit ? '#EF4444' : '#10B981',
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', minWidth: '50px' }}>
                            {p.stock} / {p.lowStockThreshold}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`status-pill ${
                            p.stock === 0 ? 'danger' : isCrit ? 'warning' : 'success'
                          }`}
                          style={{ fontSize: '0.72rem' }}
                        >
                          {p.stock === 0 ? 'Depleted' : isCrit ? 'Low Stock' : 'Optimal'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn-secondary btn-sm"
                          onClick={() => handleQuickRestock(p.id, 20)}
                        >
                          +20 Units
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. SALES PERFORMANCE & GRAPHS */}
      {sellerTab === 'performance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem' }}>Sales Performance & Analytics</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Real-time revenue reports, order conversions, and sales volume trajectories.
            </p>
          </div>

          {/* Metric Cards */}
          <div className="stat-card-grid">
            <div className="glass-panel stat-card">
              <div className="stat-card-header">
                <span>TOTAL REVENUE</span>
                <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818CF8' }}>
                  <DollarSign size={18} />
                </div>
              </div>
              <div className="stat-value">${totalRevenue.toFixed(2)}</div>
              <div className="stat-change up">
                <ArrowUpRight size={14} /> +24.8% vs last month
              </div>
            </div>

            <div className="glass-panel stat-card">
              <div className="stat-card-header">
                <span>TOTAL UNITS SOLD</span>
                <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399' }}>
                  <Package size={18} />
                </div>
              </div>
              <div className="stat-value">{totalUnitsSold}</div>
              <div className="stat-change up">
                <ArrowUpRight size={14} /> +18.2% vs last month
              </div>
            </div>

            <div className="glass-panel stat-card">
              <div className="stat-card-header">
                <span>AVERAGE ORDER VALUE</span>
                <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#22D3EE' }}>
                  <TrendingUp size={18} />
                </div>
              </div>
              <div className="stat-value">${averageOrderValue.toFixed(2)}</div>
              <div className="stat-change up">
                <ArrowUpRight size={14} /> Healthy cart size
              </div>
            </div>

            <div className="glass-panel stat-card">
              <div className="stat-card-header">
                <span>ACTIVE LISTINGS</span>
                <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24' }}>
                  <Layers size={18} />
                </div>
              </div>
              <div className="stat-value">{sellerProducts.length}</div>
              <div className="stat-change" style={{ color: 'var(--text-muted)' }}>
                Across {new Set(sellerProducts.map((p) => p.category)).size} categories
              </div>
            </div>
          </div>

          {/* Graphical Sales Trend Chart (Bespoke SVG) */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem' }}>Revenue Growth & Trends (2026)</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Monthly gross marketplace volume</p>
              </div>
              <span className="status-pill success">+38.5% YoY Growth</span>
            </div>

            {/* Custom SVG Line & Area Chart */}
            <div style={{ width: '100%', height: '220px', position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 600 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal Guide Lines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                <line x1="0" y1="90" x2="600" y2="90" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                <line x1="0" y1="140" x2="600" y2="140" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                
                {/* Area Fill */}
                <polygon
                  points="0,170 50,150 100,140 150,110 200,125 250,90 300,95 350,60 400,75 450,45 500,50 550,30 600,20 600,190 0,190"
                  fill="url(#chartGradient)"
                />
                
                {/* Stroke Line */}
                <polyline
                  points="0,170 50,150 100,140 150,110 200,125 250,90 300,95 350,60 400,75 450,45 500,50 550,30 600,20"
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="3"
                />

                {/* Key data nodes */}
                <circle cx="250" cy="90" r="4" fill="#06B6D4" />
                <circle cx="450" cy="45" r="4" fill="#06B6D4" />
                <circle cx="600" cy="20" r="5" fill="#10B981" />
              </svg>

              {/* Month Labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', fontSize: '0.75rem', marginTop: '8px' }}>
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
              </div>
            </div>
          </div>

          {/* Top Selling Products Leaderboard */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Top-Selling Catalog Products</h3>
            <div className="table-container">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Unit Price</th>
                    <th>Customer Rating</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerProducts.slice(0, 4).map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600, color: '#fff' }}>{p.name}</td>
                      <td><span className="status-pill info">{p.category}</span></td>
                      <td>${p.price.toFixed(2)}</td>
                      <td>★ {p.rating} ({p.reviewCount} reviews)</td>
                      <td><span className="status-pill success">Bestseller</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW PRODUCT LISTING MODAL */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem' }}>Create Product Listing</h3>
              <button
                className="icon-action-btn"
                style={{ width: '32px', height: '32px' }}
                onClick={() => setIsAddModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Product Title / Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Precision CNC Aluminum Keyboard"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Enter detailed specifications and product highlights..."
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Audio">Audio</option>
                      <option value="Workspaces">Workspaces</option>
                      <option value="Wearables">Wearables</option>
                      <option value="Home & Living">Home & Living</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Initial Stock Units</label>
                    <input
                      type="number"
                      className="form-input"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value, 10) || 0 })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Low Stock Alert Threshold</label>
                    <input
                      type="number"
                      className="form-input"
                      value={productForm.lowStockThreshold}
                      onChange={(e) => setProductForm({ ...productForm, lowStockThreshold: parseInt(e.target.value, 10) || 5 })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Product Image URL (High-Res Unsplash)</label>
                  <input
                    type="url"
                    className="form-input"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Search Tags (comma separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={productForm.tags}
                    onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Publish Product Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT LISTING MODAL */}
      {editingProduct && (
        <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem' }}>Edit Listing: {editingProduct.name}</h3>
              <button
                className="icon-action-btn"
                style={{ width: '32px', height: '32px' }}
                onClick={() => setEditingProduct(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateProductSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Product Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Stock Units</label>
                    <input
                      type="number"
                      className="form-input"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value, 10) || 0 })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={editingProduct.image}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
