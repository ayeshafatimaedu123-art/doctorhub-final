const statusConfig = {
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  payment_uploaded: { label: 'Payment Uploaded', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  payment_verified: { label: 'Payment Verified', className: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
  confirmed: { label: 'Confirmed', className: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  rejected: { label: 'Rejected', className: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
  verified: { label: 'Verified', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  active: { label: 'Active', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  inactive: { label: 'Inactive', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  approved: { label: 'Approved', className: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
  unapproved: { label: 'Pending Review', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || { label: status, className: 'bg-slate-100 text-slate-600' };
  return (
    <span className={`badge-status ${config.className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
