import { useEffect, useState } from 'react';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';
import toast from 'react-hot-toast';

const ROLES = ['', 'patient', 'doctor', 'assistant', 'admin', 'superadmin'];

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadUsers = () => {
    setLoading(true);
    const params = { page, limit: 10, ...(search && { search }), ...(roleFilter && { role: roleFilter }) };
    api.get('/admin/users', { params })
      .then(r => { setUsers(r.data.data); setTotalPages(r.data.pages || 1); })
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, [page, roleFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadUsers();
  };

  const handleToggle = async (id) => {
    try {
      const res = await api.put(`/admin/users/${id}/toggle`);
      setUsers(p => p.map(u => u._id === id ? { ...u, isActive: res.data.data.isActive } : u));
      toast.success(res.data.message);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const roleColors = {
    patient: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
    doctor: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    assistant: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    admin: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    superadmin: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  };

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="page-title">Manage Users</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">View and manage all registered users</p>
      </div>

      {/* Filters */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="input-field flex-1" />
          <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }} className="input-field sm:w-44">
            {ROLES.map(r => <option key={r} value={r}>{r ? r.charAt(0).toUpperCase() + r.slice(1) : 'All Roles'}</option>)}
          </select>
          <button type="submit" className="btn-primary px-6 whitespace-nowrap">Search</button>
        </form>
      </div>

      {loading ? <Spinner center /> : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header">
                  <th className="text-left px-5 py-3.5">User</th>
                  <th className="text-left px-5 py-3.5">Role</th>
                  <th className="text-left px-5 py-3.5">Phone</th>
                  <th className="text-left px-5 py-3.5">Joined</th>
                  <th className="text-left px-5 py-3.5">Status</th>
                  <th className="text-left px-5 py-3.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {users.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-slate-400">No users found</td></tr>
                ) : users.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-teal-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {u.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{u.name}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge-status capitalize ${roleColors[u.role] || ''}`}>{u.role}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{u.phone || '—'}</td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={u.isActive ? 'active' : 'inactive'} />
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggle(u._id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${u.isActive ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'}`}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t border-slate-100 dark:border-slate-800">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-xl font-semibold text-sm transition-all ${page === p ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'}`}>{p}</button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
