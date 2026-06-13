/**
 * Generate a random token
 */
const generateToken = (length = 6) => {
  return Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
};

/**
 * Format date to Pakistan locale
 */
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-PK', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
};

/**
 * Format currency in PKR
 */
const formatCurrency = (amount) => `Rs. ${Number(amount).toLocaleString('en-PK')}`;

/**
 * Paginate results helper
 */
const paginate = (page = 1, limit = 10) => ({
  skip: (Number(page) - 1) * Number(limit),
  limit: Number(limit)
});

/**
 * Build pagination response
 */
const paginationResponse = (total, page, limit) => ({
  total,
  page: Number(page),
  limit: Number(limit),
  pages: Math.ceil(total / Number(limit)),
  hasNext: Number(page) < Math.ceil(total / Number(limit)),
  hasPrev: Number(page) > 1
});

/**
 * Filter object — remove empty/undefined fields
 */
const filterEmpty = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== '' && v !== undefined && v !== null));

/**
 * Async handler wrapper — eliminates try/catch boilerplate
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { generateToken, formatDate, formatCurrency, paginate, paginationResponse, filterEmpty, asyncHandler };
