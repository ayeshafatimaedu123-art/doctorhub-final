const EmptyState = ({ icon = '📭', title = 'Nothing here yet', description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-6xl mb-4">{icon}</div>
    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
    {description && <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mb-6">{description}</p>}
    {action && action}
  </div>
);

export default EmptyState;
