const StatCard = ({ title, value, icon, color = 'primary', change, suffix = '' }) => {
  const colorMap = {
    primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
    teal: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',
    violet: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
    rose: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  };

  return (
    <div className="card flex items-center gap-4 animate-in-up">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}{suffix}</p>
          {change !== undefined && (
            <span className={`text-xs font-semibold ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
