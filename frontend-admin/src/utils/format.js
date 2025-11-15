export const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(Number.isFinite(value) ? value : 0);

export const formatDate = (value, options = {}) => {
  // Return fallback for null, undefined, or empty values
  if (!value) {
    return 'N/A';
  }

  const date = value instanceof Date ? value : new Date(value);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options
  }).format(date);
};
