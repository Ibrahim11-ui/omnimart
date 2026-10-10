import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Users,
  Layers,
  ShoppingBag,
  Activity,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  RefreshCw,
  Ban,
} from 'lucide-react';
import type { User, UserRole, Product, OrderStatus, ComplianceStatus } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    users,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    products,
    updateProduct,
    deleteProduct,
    setProductCompliance,
    orders,
    updateOrderStatus,
    cancelOrder,
    activityLogs,
    addActivityLog,
    currentUser,
    showToast,
  } = useStore();

  // Filter states
  const [userSearch, setUserSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [activityFilter, setActivityFilter] = useState<string>('all');

  // User Modals
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'buyer' as UserRole,
    phone: '',
  });

  // Product Edit Modal
  const [editingAdminProduct, setEditingAdminProduct] = useState<Product | null>(null);

  // Filtered lists
  const filteredUsers = users.filter((u) => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.includes(q);
  });

  const filteredProducts = products.filter((p) => {
    if (!productSearch) return true;
    const q = productSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.sellerName.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'All') return true;
    return o.status === orderStatusFilter;
  });

  const filteredActivities = activityLogs.filter((a) => {
    if (activityFilter === 'all') return true;
    return a.type === activityFilter;
  });

  // Handlers
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email) return;

    addUser({
      name: userForm.name,
      email: userForm.email,
      role: userForm.role,
      status: 'active',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80`,
      phone: userForm.phone || '+1 (555) 000-0000',
      addresses: [],
      paymentCards: [],
    });

    setIsAddUserModalOpen(false);
    setUserForm({ name: '', email: '', role: 'buyer', phone: '' });
  };

  const handleUpdateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUser(editingUser.id, {
      name: editingUser.name,
      email: editingUser.email,
      role: editingUser.role,
      phone: editingUser.phone,
    });
    setEditingUser(null);
  };

  const handleUpdateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdminProduct) return;
    updateProduct(editingAdminProduct.id, {
      name: editingAdminProduct.name,
      price: Number(editingAdminProduct.price),
      category: editingAdminProduct.category,
      status: editingAdminProduct.status,
    });
    setEditingAdminProduct(null);
  };

  const handleSimulateEvent = () => {
    addActivityLog({
      type: 'system',
      actorName: 'Audit Daemon',
      actorRole: 'system',
      action: 'Routine Security Integrity Scan',
      details: 'Validated payment gateway encryption and session credentials. 0 anomalies detected.',
      severity: 'info',
    });
    showToast('Simulation: Security Audit Log Triggered', 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Admin Subnav Tabs */}
      <div className="subnav-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={adminTab === 'users'}
          className={`subnav-tab-btn ${adminTab === 'users' ? 'active' : ''}`}
          onClick={() => setAdminTab('users')}
        >
          <Users size={16} />
          User Management ({users.length})
        </button>

        <button
          role="tab"
          aria-selected={adminTab === 'products'}
          className={`subnav-tab-btn ${adminTab === 'products' ? 'active' : ''}`}
          onClick={() => setAdminTab('products')}
        >
          <Layers size={16} />
          Product Catalog & Compliance ({products.length})
        </button>

        <button
          role="tab"
          aria-selected={adminTab === 'orders'}
          className={`subnav-tab-btn ${adminTab === 'orders' ? 'active' : ''}`}
          onClick={() => setAdminTab('orders')}
        >
          <ShoppingBag size={16} />
          Global Order Fulfillment ({orders.length})
        </button>

        <button
          role="tab"
          aria-selected={adminTab === 'monitoring'}
          className={`subnav-tab-btn ${adminTab === 'monitoring' ? 'active' : ''}`}
          onClick={() => setAdminTab('monitoring')}
        >
          <Activity size={16} />
          System Activity Monitoring ({activityLogs.length})
        </button>
      </div>

      {/* 1. USER MANAGEMENT */}
      {adminTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem' }}>User Account & Role Management</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Create, update, or remove user accounts. Configure roles (Admin / Seller / Buyer) and toggle account status.
              </p>
            </div>
            <button className="btn-primary" onClick={() => setIsAddUserModalOpen(true)}>
              <Plus size={16} /> Add New User
            </button>
          </div>

          {/* User Search Bar */}
          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px' }}
            />
            <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Users Table */}
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>User Profile</th>
                  <th>Role</th>
                  <th>Account Status</th>
                  <th>Contact</th>
                  <th>Joined Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const isAdmin = u.role === 'admin';
                  const isSeller = u.role === 'seller';
                  const isSuspended = u.status === 'suspended';

                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={u.avatar}
                            alt={u.name}
                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>{u.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <select
                          aria-label={`Change role for ${u.name}`}
                          className="form-select"
                          value={u.role}
                          onChange={(e) => updateUser(u.id, { role: e.target.value as UserRole })}
                          style={{
                            padding: '4px 8px',
                            fontSize: '0.78rem',
                            width: 'auto',
                            borderColor: isAdmin ? '#8B5CF6' : isSeller ? '#06B6D4' : 'var(--border-subtle)',
                          }}
                        >
                          <option value="admin">Admin</option>
                          <option value="seller">Seller</option>
                          <option value="buyer">Buyer</option>
                        </select>
                      </td>
                      <td>
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className={`status-pill ${isSuspended ? 'danger' : 'success'}`}
                          style={{ cursor: 'pointer', border: 'none' }}
                          title="Click to toggle status"
                        >
                          <span className="status-dot" />
                          {u.status.toUpperCase()}
                        </button>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {u.phone || 'N/A'}
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            className="btn-secondary btn-sm"
                            onClick={() => setEditingUser(u)}
                            title="Edit User"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            className="btn-danger btn-sm"
                            onClick={() => deleteUser(u.id)}
                            title="Delete User"
                            disabled={u.id === currentUser.id}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. PRODUCT MANAGEMENT & COMPLIANCE */}
      {adminTab === 'products' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem' }}>Global Product Management & Compliance</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Oversee marketplace catalog. Enforce regulatory compliance by approving, reviewing, or flagging listings.
            </p>
          </div>

          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Search products by title, seller, or category..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px' }}
            />
            <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Product Listing</th>
                  <th>Category</th>
                  <th>Seller</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Compliance Status</th>
                  <th style={{ textAlign: 'right' }}>Compliance Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={p.image}
                          alt={p.name}
                          style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>{p.name}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>ID: {p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="status-pill info" style={{ fontSize: '0.72rem' }}>{p.category}</span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>
                      {p.sellerName}
                    </td>
                    <td style={{ fontWeight: 700, color: '#fff' }}>
                      ${p.price.toFixed(2)}
                    </td>
                    <td>
                      <span className={`status-pill ${p.stock <= p.lowStockThreshold ? 'warning' : 'success'}`} style={{ fontSize: '0.72rem' }}>
                        {p.stock} units
                      </span>
                    </td>
                    <td>
                      <select
                        aria-label={`Change compliance status for ${p.name}`}
                        className="form-select"
                        value={p.status}
                        onChange={(e) => setProductCompliance(p.id, e.target.value as ComplianceStatus)}
                        style={{
                          padding: '4px 8px',
                          fontSize: '0.76rem',
                          width: 'auto',
                          borderColor:
                            p.status === 'approved'
                              ? '#10B981'
                              : p.status === 'flagged'
                              ? '#EF4444'
                              : '#F59E0B',
                        }}
                      >
                        <option value="approved">Approved</option>
                        <option value="under_review">Under Review</option>
                        <option value="flagged">Flagged</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          className="btn-secondary btn-sm"
                          onClick={() => setEditingAdminProduct(p)}
                          title="Edit Details"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="btn-danger btn-sm"
                          onClick={() => deleteProduct(p.id)}
                          title="Remove Listing"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. ORDER MANAGEMENT */}
      {adminTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem' }}>Global Order Processing & Fulfillment</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                System-wide order lifecycle tracking, fulfillment resolution, and emergency cancellation overrides.
              </p>
            </div>

            {/* Filter buttons */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['All', 'pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'].map((st) => (
                <button
                  key={st}
                  className={`btn-sm ${orderStatusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setOrderStatusFilter(st)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Order Ref</th>
                  <th>Buyer Info</th>
                  <th>Items Purchased</th>
                  <th>Total Amount</th>
                  <th>Current Status</th>
                  <th>Override Status</th>
                  <th style={{ textAlign: 'right' }}>Resolution Options</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                      No orders matching filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id}>
                      <td style={{ fontWeight: 700, color: '#A5B4FC' }}>
                        {ord.orderNumber}
                      </td>
                      <td>
                        <div style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>{ord.buyerName}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>{ord.buyerEmail}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {ord.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                        </div>
                      </td>
                      <td style={{ fontWeight: 800, color: '#fff' }}>
                        ${ord.totalAmount.toFixed(2)}
                      </td>
                      <td>
                        <span
                          className={`status-pill ${
                            ord.status === 'delivered'
                              ? 'success'
                              : ord.status === 'cancelled'
                              ? 'danger'
                              : 'warning'
                          }`}
                          style={{ fontSize: '0.72rem' }}
                        >
                          {ord.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <select
                          aria-label={`Change order status for ${ord.orderNumber}`}
                          className="form-select"
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus, 'Updated via Admin Console')}
                          style={{ padding: '4px 8px', fontSize: '0.76rem', width: 'auto' }}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {ord.status !== 'cancelled' ? (
                          <button
                            className="btn-danger btn-sm"
                            onClick={() => cancelOrder(ord.id, 'Cancelled via administrator intervention')}
                            title="Cancel Order & Restore Stock"
                          >
                            <Ban size={12} />
                            Cancel & Refund
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Refunded</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. REAL-TIME SYSTEM ACTIVITY MONITORING */}
      {adminTab === 'monitoring' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem' }}>Real-Time System Activity & Interaction Stream</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Live auditing feed capturing user registrations, catalog mutations, order transactions, and stock alarms.
              </p>
            </div>
            <button className="btn-secondary" onClick={handleSimulateEvent}>
              <RefreshCw size={14} /> Simulate Security Scan
            </button>
          </div>

          {/* Quick Stats Banner */}
          <div className="stat-card-grid">
            <div className="glass-panel stat-card">
              <div className="stat-card-header">
                <span>TOTAL REGISTERED USERS</span>
                <Users size={16} color="var(--primary)" />
              </div>
              <div className="stat-value">{users.length}</div>
            </div>

            <div className="glass-panel stat-card">
              <div className="stat-card-header">
                <span>TOTAL PRODUCTS</span>
                <Layers size={16} color="var(--accent-cyan)" />
              </div>
              <div className="stat-value">{products.length}</div>
            </div>

            <div className="glass-panel stat-card">
              <div className="stat-card-header">
                <span>TOTAL ORDERS PROCESSED</span>
                <ShoppingBag size={16} color="var(--accent-emerald)" />
              </div>
              <div className="stat-value">{orders.length}</div>
            </div>

            <div className="glass-panel stat-card">
              <div className="stat-card-header">
                <span>RECORDED EVENTS</span>
                <Activity size={16} color="var(--accent-purple)" />
              </div>
              <div className="stat-value">{activityLogs.length}</div>
            </div>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'user', 'product', 'order', 'system'].map((cat) => (
              <button
                key={cat}
                className={`btn-sm ${activityFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActivityFilter(cat)}
                style={{ textTransform: 'capitalize' }}
              >
                {cat} Events
              </button>
            ))}
          </div>

          {/* Live Activity Stream List */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredActivities.map((log) => {
                let badgeColor = 'info';
                if (log.severity === 'success') badgeColor = 'success';
                else if (log.severity === 'warning') badgeColor = 'warning';
                else if (log.severity === 'alert') badgeColor = 'danger';

                return (
                  <div
                    key={log.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      padding: '14px 18px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <span className={`status-pill ${badgeColor}`} style={{ marginTop: '2px', textTransform: 'uppercase', fontSize: '0.68rem' }}>
                      {log.severity}
                    </span>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>
                            {log.action}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                            by {log.actorName} ({log.actorRole})
                          </span>
                        </div>
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                          {log.timestamp}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginTop: '4px' }}>
                        {log.details}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ADD USER MODAL */}
      {isAddUserModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddUserModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem' }}>Register New User</h3>
              <button
                className="icon-action-btn"
                style={{ width: '32px', height: '32px' }}
                onClick={() => setIsAddUserModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    placeholder="e.g. Jordan Miller"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="jordan.miller@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Role Assignment</label>
                  <select
                    className="form-select"
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value as UserRole })}
                  >
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    placeholder="+1 (555) 902-1144"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsAddUserModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="modal-overlay" onClick={() => setEditingUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem' }}>Edit User: {editingUser.name}</h3>
              <button
                className="icon-action-btn"
                style={{ width: '32px', height: '32px' }}
                onClick={() => setEditingUser(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateUserSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                  >
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingUser.phone || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setEditingUser(null)}
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

      {/* EDIT ADMIN PRODUCT MODAL */}
      {editingAdminProduct && (
        <div className="modal-overlay" onClick={() => setEditingAdminProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem' }}>Product Compliance & Audit</h3>
              <button
                className="icon-action-btn"
                style={{ width: '32px', height: '32px' }}
                onClick={() => setEditingAdminProduct(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateProductSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingAdminProduct.name}
                    onChange={(e) => setEditingAdminProduct({ ...editingAdminProduct, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={editingAdminProduct.price}
                    onChange={(e) => setEditingAdminProduct({ ...editingAdminProduct, price: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Compliance Status</label>
                  <select
                    className="form-select"
                    value={editingAdminProduct.status}
                    onChange={(e) => setEditingAdminProduct({ ...editingAdminProduct, status: e.target.value as ComplianceStatus })}
                  >
                    <option value="approved">Approved</option>
                    <option value="under_review">Under Review</option>
                    <option value="flagged">Flagged</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setEditingAdminProduct(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Product Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
