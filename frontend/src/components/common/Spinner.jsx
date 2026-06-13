const Spinner = ({ size = 'md', center = false }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={center ? 'flex items-center justify-center min-h-[200px]' : ''}>
      <div className={`${sizes[size]} border-3 border-slate-200 dark:border-slate-700 border-t-primary-500 rounded-full animate-spin`} style={{ borderWidth: '3px' }} />
    </div>
  );
};

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-slate-500 dark:text-slate-400 font-medium">Loading Doctor Hub...</p>
    </div>
  </div>
);

export default Spinner;
