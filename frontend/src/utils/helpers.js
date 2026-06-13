/**
 * Format a date to Pakistan locale
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-PK', {
    day: 'numeric', month: 'short', year: 'numeric',
    ...options
  });
};

/**
 * Format date + time
 */
export const formatDateTime = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-PK', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

/**
 * Format PKR currency
 */
export const formatCurrency = (amount) =>
  amount != null ? `Rs. ${Number(amount).toLocaleString('en-PK')}` : '—';

/**
 * Get initials from a name
 */
export const getInitials = (name = '') =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

/**
 * Truncate text
 */
export const truncate = (text = '', maxLength = 100) =>
  text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

/**
 * Status label map
 */
export const STATUS_LABELS = {
  pending: 'Pending',
  payment_uploaded: 'Payment Uploaded',
  payment_verified: 'Payment Verified',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
  verified: 'Verified',
  active: 'Active',
  inactive: 'Inactive',
};

/**
 * Role dashboard paths
 */
export const ROLE_DASHBOARDS = {
  patient: '/patient/dashboard',
  doctor: '/doctor/dashboard',
  assistant: '/assistant/dashboard',
  admin: '/admin/dashboard',
  superadmin: '/admin/dashboard',
};

/**
 * Get greeting based on time
 */
export const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 18) return 'Good Afternoon';
  return 'Good Evening';
};

/**
 * Debounce function
 */
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Check if date is today
 */
export const isToday = (date) => {
  const d = new Date(date);
  const today = new Date();
  return d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();
};

/**
 * Generate avatar color from name
 */
export const avatarColor = (name = '') => {
  const colors = [
    'from-primary-400 to-teal-400',
    'from-violet-400 to-purple-400',
    'from-rose-400 to-pink-400',
    'from-amber-400 to-orange-400',
    'from-teal-400 to-green-400',
    'from-indigo-400 to-primary-400',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};
