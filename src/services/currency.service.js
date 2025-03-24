/**
 * Service for currency related operations
 */

// List of available currencies
const currencies = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR' },
  RUB: { code: 'RUB', symbol: '₽', name: 'Russian Ruble', locale: 'ru-RU' }
};

/**
 * Format a number as currency based on currency code
 * 
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - The currency code (e.g., 'USD')
 * @param {boolean} useSymbol - Whether to include the currency symbol
 * @returns {string} - Formatted currency string
 */
const formatCurrency = (amount, currencyCode = 'USD', useSymbol = true) => {
  if (amount === undefined || amount === null) return '';
  
  const currencyInfo = currencies[currencyCode] || currencies.USD;
  
  try {
    // Use Intl.NumberFormat for proper locale-based formatting
    return new Intl.NumberFormat(currencyInfo.locale, {
      style: useSymbol ? 'currency' : 'decimal',
      currency: useSymbol ? currencyCode : undefined,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    // Fallback to basic formatting
    return useSymbol 
      ? `${currencyInfo.symbol}${parseFloat(amount).toFixed(2)}`
      : parseFloat(amount).toFixed(2);
  }
};

/**
 * Get currency symbol from currency code
 * 
 * @param {string} currencyCode - The currency code
 * @returns {string} - Currency symbol
 */
const getCurrencySymbol = (currencyCode) => {
  return currencies[currencyCode]?.symbol || '$';
};

/**
 * Get list of all supported currencies
 * 
 * @returns {Array} - List of currency objects
 */
const getAllCurrencies = () => {
  return Object.values(currencies);
};

const CurrencyService = {
  formatCurrency,
  getCurrencySymbol,
  getAllCurrencies
};

export default CurrencyService;
