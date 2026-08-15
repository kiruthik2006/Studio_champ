import React, { useState } from 'react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../context/ToastContext';
import { Users, Shield, User, Check, X, ShieldAlert, Key } from 'lucide-react';

export const UserManager = ({ users = [], onRefresh }) => {
  const [updatingId, setUpdatingId] = useState(null);
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

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Users size={20} color="#dfb94a" /> User Management ({safeUsers.length})
        </h2>
        <p style={{ color: 'var(--gray-light)', fontSize: '0.85rem' }}>
          Manage user accounts, administrator privileges, and authentication status.
        </p>
      </div>

      <div style={{ overflowX: 'auto' }}>
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
            {safeUsers.map((u) => (
              <tr key={u.id}>
                <td>
                  <div style={{ fontWeight: 600, color: '#fff' }}>
                    {u.full_name || `${u.first_name} ${u.last_name}`}
                  </div>
                </td>
                <td style={{ color: 'var(--gray-light)', fontSize: '0.85rem' }}>
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
                <td style={{ fontSize: '0.8rem', color: 'var(--gray-light)' }}>
                  {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleToggleRole(u)}
                      disabled={updatingId === u.id}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                      title="Toggle Admin/User Role"
                    >
                      <Shield size={12} /> {u.role === 'admin' ? 'Demote' : 'Make Admin'}
                    </button>

                    <button
                      onClick={() => handleToggleActive(u)}
                      disabled={updatingId === u.id}
                      className={`btn ${u.is_active ? 'btn-danger' : 'btn-success'} btn-sm`}
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                      title="Toggle Active/Deactivated"
                    >
                      {u.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
