import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPayments, verifyPayment } from '../../redux/slices/paymentSlice';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';

const PaymentVerification = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector(s => s.payments);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [imageModal, setImageModal] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    dispatch(fetchPayments({ status: statusFilter || undefined }));
  }, [statusFilter]);

  const handleVerify = (id) => dispatch(verifyPayment({ id, action: 'verify' }));
  const handleReject = () => {
    if (!rejectReason.trim()) return;
    dispatch(verifyPayment({ id: rejectModal, action: 'reject', rejectionReason: rejectReason }));
    setRejectModal(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="page-title">Payment Verification</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Review and verify patient payment screenshots</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['pending', 'verified', 'rejected', ''].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${statusFilter === s ? 'bg-primary-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? <Spinner center /> : list.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-5xl mb-4">✅</p>
          <p className="font-semibold text-slate-900 dark:text-white mb-2">No payments to show</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">All {statusFilter} payments processed</p>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map(p => (
            <div key={p._id} className="card hover:shadow-card-hover transition-all">
              <div className="flex items-start gap-4 flex-wrap">
                {/* Screenshot thumbnail */}
                <button onClick={() => setImageModal(p.screenshot)} className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 hover:opacity-90 transition-opacity border-2 border-slate-200 dark:border-slate-700 group">
                  <img src={p.screenshot} alt="Payment" className="w-full h-full object-cover group-hover:scale-105 transition-transform" onError={e => { e.target.style.display='none'; e.target.parentElement.innerHTML='<div class="w-full h-full flex items-center justify-center text-slate-400 text-xs">📄</div>'; }} />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{p.patientId?.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{p.patientId?.email}</p>
                    </div>
                    <StatusBadge status={p.verificationStatus} />
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm">
                    <span className="font-bold text-slate-900 dark:text-white">Rs. {p.amount?.toLocaleString()}</span>
                    <span className="text-slate-500 dark:text-slate-400 capitalize">{p.paymentMethod?.replace('_', ' ')}</span>
                    {p.transactionId && <span className="text-slate-400">TXN: {p.transactionId}</span>}
                    <span className="text-slate-400">{new Date(p.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {p.rejectionReason && (
                    <p className="text-xs text-red-500 mt-1.5 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-lg inline-block">Rejected: {p.rejectionReason}</p>
                  )}
                  {p.verifiedBy && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1.5">✓ Verified by {p.verifiedBy?.name}</p>
                  )}
                </div>

                {/* Actions */}
                {p.verificationStatus === 'pending' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleVerify(p._id)} className="bg-green-500 hover:bg-green-600 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-colors active:scale-95 flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      Verify
                    </button>
                    <button onClick={() => setRejectModal(p._id)} className="btn-danger text-sm py-2 px-4 flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {imageModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setImageModal(null)}>
          <div className="max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <img src={imageModal} alt="Payment Screenshot" className="w-full rounded-2xl shadow-2xl" />
            <button onClick={() => setImageModal(null)} className="mt-4 w-full bg-white/10 text-white py-2.5 rounded-xl font-semibold hover:bg-white/20 transition-colors">Close</button>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-md animate-in">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-4">Reject Payment</h3>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Rejection Reason *</label>
              <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} className="input-field resize-none" placeholder="e.g. Screenshot unclear, wrong amount, unverifiable transaction..." />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleReject} disabled={!rejectReason.trim()} className="btn-danger flex-1">Reject Payment</button>
              <button onClick={() => { setRejectModal(null); setRejectReason(''); }} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentVerification;
