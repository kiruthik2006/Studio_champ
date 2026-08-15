import React, { useState, useMemo } from 'react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../context/ToastContext';
import { Users, Shield, User, Search } from 'lucide-react';

export const UserManager = ({ users = [], onRefresh }) => {
  const [updatingId, setUpdatingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  const handleToggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change role of ${user.full_name || user.email} to "${newRole}"?`)) {
      return;
    }

    setUpdatingId(user.id);
    try {
      await adminApi.updateUser(user.id, { role: newRole });
      showToast(`User role changed to ${newRole}`, 'success');
      onRefresh();
    } catch (err) {
      showToast(err.message || 'Failed to update user role', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleActive = async (user) => {
    const newStatus = !user.is_active;
    setUpdatingId(user.id);
    try {
      await adminApi.updateUser(user.id, { is_active: newStatus });
      showToast(`User account ${newStatus ? 'activated' : 'deactivated'}`, 'success');
      onRefresh();
    } catch (err) {
      showToast(err.message || 'Failed to update user status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const safeUsers = Array.isArray(users) ? users : [];

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return safeUsers;
    const q = searchQuery.toLowerCase();
    return safeUsers.filter(
      (u) =>
        (u.full_name && u.full_name.toLowerCase().includes(q)) ||
        (u.first_name && u.first_name.toLowerCase().includes(q)) ||
        (u.last_name && u.last_name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.role && u.role.toLowerCase().includes(q))
    );
  }, [safeUsers, searchQuery]);

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Users size={20} color="var(--primary)" /> User Directory ({filteredUsers.length})
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Manage user permissions, administrator privileges, and authentication status.
          </p>
        </div>

        {/* Quick Search */}
        <div style={{ position: 'relative', width: '240px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2rem', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      <div style={{ overflowX: 'auto', overscrollBehavior: 'none' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  No users match "{searchQuery}"
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
                const initial = u.first_name ? u.first_name[0].toUpperCase() : 'U';
                const createdDate = u.created_at ? u.created_at.split('T')[0] : 'N/A';

                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: 'var(--avatar-bg)',
                          color: 'var(--avatar-text)',
                          border: '1px solid var(--avatar-border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}>
                          {initial}
                        </div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                          {u.full_name || `${u.first_name} ${u.last_name}`}
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {u.email}
                    </td>
                    <td>
                      <span className={`status-badge ${u.role === 'admin' ? 'badge-gold' : 'badge-active'}`}>
                        {u.role === 'admin' ? <Shield size={11} /> : <User size={11} />}
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${u.is_active ? 'badge-active' : 'badge-inactive'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {createdDate}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.45rem' }}>
                        <button
                          onClick={() => handleToggleRole(u)}
                          disabled={updatingId === u.id}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.28rem 0.55rem', fontSize: '0.75rem' }}
                          title="Toggle Admin/User Role"
                        >
                          <Shield size={12} /> {u.role === 'admin' ? 'Demote' : 'Make Admin'}
                        </button>

                        <button
                          onClick={() => handleToggleActive(u)}
                          disabled={updatingId === u.id}
                          className={`btn ${u.is_active ? 'btn-danger' : 'btn-success'} btn-sm`}
                          style={{ padding: '0.28rem 0.55rem', fontSize: '0.75rem' }}
                          title="Toggle Active/Deactivated"
                        >
                          {u.is_active ? 'Deactivate' : 'Activate'}
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
  );
};
