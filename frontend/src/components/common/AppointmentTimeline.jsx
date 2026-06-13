const WORKFLOW_STEPS = [
  { key: 'pending', label: 'Booked', icon: '📋', desc: 'Appointment created' },
  { key: 'payment_uploaded', label: 'Payment', icon: '💳', desc: 'Screenshot uploaded' },
  { key: 'payment_verified', label: 'Verified', icon: '✅', desc: 'Payment confirmed' },
  { key: 'confirmed', label: 'Confirmed', icon: '🎫', desc: 'Slot confirmed' },
  { key: 'completed', label: 'Completed', icon: '🏥', desc: 'Consultation done' },
];

const STATUS_ORDER = {
  pending: 0, payment_uploaded: 1, payment_verified: 2,
  confirmed: 3, completed: 4, cancelled: -1, rejected: -1
};

const AppointmentTimeline = ({ status }) => {
  const currentIndex = STATUS_ORDER[status] ?? 0;
  const isCancelled = status === 'cancelled' || status === 'rejected';

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl">
        <span>❌</span>
        <span className="font-semibold capitalize">{status}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {WORKFLOW_STEPS.map((step, i) => {
        const isDone = currentIndex > i;
        const isCurrent = currentIndex === i;
        const isFuture = currentIndex < i;
        return (
          <div key={step.key} className="flex items-center">
            <div className={`flex flex-col items-center min-w-[64px] ${isFuture ? 'opacity-40' : ''}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base transition-all ${isDone ? 'bg-teal-100 dark:bg-teal-900/40' : isCurrent ? 'bg-primary-100 dark:bg-primary-900/40 ring-2 ring-primary-400' : 'bg-slate-100 dark:bg-slate-800'}`}>
                {step.icon}
              </div>
              <p className={`text-xs font-medium mt-1 text-center whitespace-nowrap ${isCurrent ? 'text-primary-600 dark:text-primary-400' : isDone ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-600'}`}>
                {step.label}
              </p>
            </div>
            {i < WORKFLOW_STEPS.length - 1 && (
              <div className={`h-0.5 w-4 mx-0.5 rounded-full flex-shrink-0 ${isDone ? 'bg-teal-400' : 'bg-slate-200 dark:bg-slate-700'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AppointmentTimeline;
