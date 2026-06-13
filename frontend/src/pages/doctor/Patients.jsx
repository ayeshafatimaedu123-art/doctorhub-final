import { useEffect, useState } from 'react';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

const DoctorPatients = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/history').then(r => setHistory(r.data.data)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  // Unique patients from history
  const patients = [...new Map(history.map(h => [h.patientId?._id, h.patientId])).values()].filter(Boolean);
  const filtered = patients.filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.email?.toLowerCase().includes(search.toLowerCase()));

  const patientHistory = selected ? history.filter(h => h.patientId?._id === selected._id) : [];

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="page-title">My Patients</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">View patient medical history and records</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-1 card p-0 overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients..." className="input-field py-2.5 text-sm" />
          </div>
          {loading ? <Spinner center /> : (
            <div className="overflow-y-auto max-h-[500px]">
              {filtered.length === 0 ? (
                <div className="text-center py-10 text-slate-400">No patients found</div>
              ) : filtered.map(p => (
                <button key={p._id} onClick={() => setSelected(p)} className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left border-b border-slate-50 dark:border-slate-800/50 last:border-0 ${selected?._id === p._id ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-teal-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {p.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm truncate ${selected?._id === p._id ? 'text-primary-700 dark:text-primary-400' : 'text-slate-900 dark:text-white'}`}>{p.name}</p>
                    <p className="text-xs text-slate-400 truncate">{p.email}</p>
                  </div>
                  <span className="text-xs text-slate-400">{history.filter(h => h.patientId?._id === p._id).length} visit(s)</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Patient Detail */}
        <div className="lg:col-span-2">
          {!selected ? (
            <div className="card h-full flex items-center justify-center min-h-[300px] text-center">
              <div>
                <p className="text-5xl mb-3">👤</p>
                <p className="font-semibold text-slate-900 dark:text-white mb-1">Select a Patient</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Click a patient from the list to view their history</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="card">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-teal-400 flex items-center justify-center text-white font-bold text-2xl">
                    {selected.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{selected.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{selected.email}</p>
                    {selected.phone && <p className="text-sm text-primary-600 dark:text-primary-400">{selected.phone}</p>}
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{patientHistory.length}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">total visits</p>
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white">Medical History</h3>
              {patientHistory.length === 0 ? (
                <div className="card text-center py-8 text-slate-400">No history records</div>
              ) : patientHistory.map(h => (
                <div key={h._id} className="card">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{h.diagnosis}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{new Date(h.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {h.prescriptionId && <span className="badge-status bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">✓ Rx</span>}
                      {h.reports?.length > 0 && <span className="badge-status bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{h.reports.length} report(s)</span>}
                    </div>
                  </div>
                  {h.symptoms?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {h.symptoms.map(s => <span key={s} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-lg">{s}</span>)}
                    </div>
                  )}
                  {h.notes && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{h.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorPatients;
