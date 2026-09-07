
// Reusable amount formatter
// Uses sender_currency_type from transaction to show correct currency symbol
export const formatTxAmount = (tx) => {
  const symbol = tx?.sender_currency_type === '$' ? '$' : '₦';
  const prefix = tx?.tran_type === 'Credit' ? '+' : '-';
  const amount = Number(tx?.amount || 0).toLocaleString();
  return `${prefix}${symbol}${amount}`;
};

// Format just the currency amount
export const formatAmount = (amount, currency = '₦') => {
  return `${currency}${Number(amount || 0).toLocaleString()}`;
};