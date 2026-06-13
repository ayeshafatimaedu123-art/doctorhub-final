import { useEffect, useState } from 'react';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = (q = '') => {
    setLoading(true);
    const params = { ...(q && { search: q }) };
    // Use admin/users with role filter to get doctors including unapproved
    api.get('/admin/users', { params: { role: 'doctor', search: q } })
      .then(r => setDoctors(r.data.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (doctorId, approve) => {
    try {
      await api.put(`/admin/doctors/${doctorId}/approve`, { isApproved: approve });
      toast.success(`Doctor ${approve ? 'approved' : 'unapproved'}!`);
      load(search);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleToggle = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/toggle`);
      setDoctors(p => p.map(d => d._id === userId ? { ...d, isActive: res.data.data.isActive } : d));
      toast.success(res.data.message);
    } catch (err) { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="page-title">Manage Doctors</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Approve and manage doctor profiles</p>
      </div>

      <div className="card">
        <div className="flex gap-3">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load(search)} placeholder="Search doctors by name or email..." className="input-field flex-1" />
          <button onClick={() => load(search)} className="btn-primary px-6">Search</button>
        </div>
      </div>

      {loading ? <Spinner center /> : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header">
                  <th className="text-left px-5 py-3.5">Doctor</th>
                  <th className="text-left px-5 py-3.5">Contact</th>
                  <th className="text-left px-5 py-3.5">Joined</th>
                  <th className="text-left px-5 py-3.5">Account</th>
                  <th className="text-left px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {doctors.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-slate-400">No doctors found</td></tr>
                ) : doctors.map(d => (
                  <tr key={d._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-primary-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {d.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">Dr. {d.name}</p>
                          <span className={`text-xs ${d.isActive ? 'text-green-500' : 'text-red-400'}`}>● {d.isActive ? 'Active' : 'Inactive'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                      <p>{d.email}</p>
                      {d.phone && <p className="text-xs">{d.phone}</p>}
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                      {new Date(d.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge-status ${d.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-500'}`}>
                        {d.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleToggle(d._id)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${d.isActive ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'}`}
                        >
                          {d.isActive ? 'Suspend' : 'Restore'}
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
    </div>
  );
};

export default ManageDoctors;
