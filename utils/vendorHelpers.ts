export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-700';
    case 'draft': return 'bg-yellow-100 text-yellow-700';
    case 'out_of_stock': return 'bg-red-100 text-red-700';
    case 'inactive': return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'نشط';
    case 'draft': return 'مسودة';
    case 'out_of_stock': return 'نفد المخزون';
    case 'inactive': return 'غير نشط';
    default: return status;
  }
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-SA');
};

// Ensure deterministic numeral rendering across SSR/CSR by explicitly setting locale
// Default to Arabic since the app is primarily Arabic, but allow passing 'en' when needed
export const formatCurrency = (amount: number, locale: 'ar' | 'en' = 'ar') => {
  const number = new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    maximumFractionDigits: 0,
  }).format(amount);
  const symbol = locale === 'ar' ? 'ر.س' : 'SAR';
  return `${number} ${symbol}`;
};

export const getStockStatus = (stock: number) => {
  if (stock === 0) return { color: 'text-red-500', text: 'نفد المخزون' };
  if (stock < 10) return { color: 'text-orange-500', text: 'مخزون منخفض' };
  return { color: 'text-green-500', text: 'متوفر' };
};