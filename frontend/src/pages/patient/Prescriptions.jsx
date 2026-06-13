import { useEffect, useState } from 'react';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/prescriptions').then(r => setPrescriptions(r.data.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="page-title">My Prescriptions</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          All prescriptions are <span className="font-semibold text-amber-600 dark:text-amber-400">locked and immutable</span> once issued
        </p>
      </div>

      {loading ? <Spinner center /> : prescriptions.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-5xl mb-4">💊</p>
          <p className="font-semibold text-slate-900 dark:text-white mb-2">No prescriptions yet</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Prescriptions from completed appointments will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map(p => (
            <div key={p._id} className="card">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-primary-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                    Rx
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-white">Dr. {p.doctorId?.name}</h3>
                      <span className="badge-status bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        🔒 Locked
                      </span>
                    </div>
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold mt-1">Diagnosis: {p.diagnosis}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {new Date(p.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
                      {p.followUpDate && ` • Follow-up: ${new Date(p.followUpDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}`}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{p.medicines?.length} medicine(s) prescribed</p>
                  </div>
                </div>
                <button onClick={() => setExpanded(expanded === p._id ? null : p._id)} className="btn-secondary text-sm py-2 px-4">
                  {expanded === p._id ? 'Hide Details' : 'View Details'}
                </button>
              </div>

              {/* Expanded */}
              {expanded === p._id && (
                <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 animate-in">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wide">Medicines</h4>
                      <div className="space-y-3">
                        {p.medicines?.map((m, i) => (
                          <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3.5">
                            <p className="font-semibold text-slate-900 dark:text-white text-sm">{m.name}</p>
                            <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {m.dosage && <span>💊 {m.dosage}</span>}
                              {m.frequency && <span>⏰ {m.frequency}</span>}
                              {m.duration && <span>📅 {m.duration}</span>}
                            </div>
                            {m.instructions && <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">ℹ️ {m.instructions}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                    {p.instructions && (
                      <div>
                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wide">Doctor's Instructions</h4>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                          {p.instructions}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientPrescriptions;
