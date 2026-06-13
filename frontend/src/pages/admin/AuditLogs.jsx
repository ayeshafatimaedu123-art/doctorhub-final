import { useEffect, useState } from 'react';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 20;

  useEffect(() => {
    setLoading(true);
    api.get('/admin/audit-logs', { params: { page, limit: LIMIT } })
      .then(r => { setLogs(r.data.data); setTotal(r.data.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  const actionColors = {
    'POST': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'PUT': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'DELETE': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'GET': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  };

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="page-title">Audit Logs</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Complete immutable activity trail — <span className="font-semibold text-slate-700 dark:text-slate-300">{total} total entries</span>
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-700 dark:text-blue-400 flex items-center gap-3">
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        All actions are permanently recorded and cannot be modified.
      </div>

      {loading ? <Spinner center /> : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header">
                  <th className="text-left px-5 py-3.5">Timestamp</th>
                  <th className="text-left px-5 py-3.5">User</th>
                  <th className="text-left px-5 py-3.5">Method</th>
                  <th className="text-left px-5 py-3.5">Action</th>
                  <th className="text-left px-5 py-3.5">Resource</th>
                  <th className="text-left px-5 py-3.5">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {logs.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-slate-400">No audit logs yet</td></tr>
                ) : logs.map(log => (
                  <tr key={log._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-5 py-3.5">
                      {log.userId ? (
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white text-xs">{log.userId.name}</p>
                          <p className="text-xs text-slate-400 capitalize">{log.userId.role}</p>
                        </div>
                      ) : <span className="text-slate-400 text-xs">System</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`badge-status text-xs ${actionColors[log.details?.method] || actionColors['GET']}`}>
                        {log.details?.method || 'N/A'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300 text-xs font-medium">{log.action}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-lg font-mono">
                        {log.resource}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs font-mono">{log.ipAddress || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {Math.ceil(total / LIMIT) > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary text-sm py-2 px-4 disabled:opacity-40">← Prev</button>
              <span className="flex items-center px-4 text-sm text-slate-500 dark:text-slate-400">Page {page} of {Math.ceil(total / LIMIT)}</span>
              <button onClick={() => setPage(p => Math.min(Math.ceil(total / LIMIT), p + 1))} disabled={page >= Math.ceil(total / LIMIT)} className="btn-secondary text-sm py-2 px-4 disabled:opacity-40">Next →</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
