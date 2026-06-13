import { useEffect, useState } from 'react';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';

const MedicalHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/history').then(r => setHistory(r.data.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="page-title">Medical History</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Your complete medical records — <span className="font-semibold text-amber-600 dark:text-amber-400">records cannot be deleted</span>
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-700 dark:text-blue-400 flex items-start gap-3">
        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <div>
          <strong>Immutable Records:</strong> Medical history is permanently stored and cannot be deleted or modified. All entries are audited.
        </div>
      </div>

      {loading ? <Spinner center /> : history.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-5xl mb-4">🏥</p>
          <p className="font-semibold text-slate-900 dark:text-white mb-2">No medical history yet</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Your records will appear here after consultations</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map(h => (
            <div key={h._id} className="card hover:shadow-card-hover transition-all">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-primary-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                    {h.doctorId?.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 dark:text-white">Dr. {h.doctorId?.name}</h3>
                      <span className="text-xs text-slate-400 dark:text-slate-500">{new Date(h.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold mb-2">Diagnosis: {h.diagnosis}</p>
                    {h.symptoms?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {h.symptoms.map(s => <span key={s} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-lg">{s}</span>)}
                      </div>
                    )}
                    {h.notes && <p className="text-xs text-slate-500 dark:text-slate-400">Notes: {h.notes}</p>}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {h.prescriptionId && (
                    <span className="badge-status bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">✓ Prescription</span>
                  )}
                  {h.reports?.length > 0 && (
                    <span className="badge-status bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{h.reports.length} Report(s)</span>
                  )}
                </div>
              </div>
              {/* Reports */}
              {h.reports?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Attached Reports</p>
                  <div className="flex flex-wrap gap-2">
                    {h.reports.map((r, i) => (
                      <a key={i} href={r.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-1.5 rounded-lg transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        {r.fileName}
                      </a>
                    ))}
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

export default MedicalHistory;
