import type { ServiceBrand } from './supabase';

export const SERVICE_BRANDS: Record<ServiceBrand, {
  label: string;
  logo: string;
  logoWhite: string;
  color: string;
  bgColor: string;
  headerBg: string;
}> = {
  consultancy: {
    label: 'SAIKI CONSULTANCY',
    logo: '/brand/SAIKI CONSULTANCY.svg',
    logoWhite: '/brand/saiki-consultancy-white-01.svg',
    color: '#6B1D3A',
    bgColor: '#f5f0f2',
    headerBg: '#6B1D3A',
  },
  technology: {
    label: 'SAIKI TECHNOLOGY',
    logo: '/brand/saiki-technology-white-01.svg',
    logoWhite: '/brand/saiki-technology-white-01.svg',
    color: '#0D4F4F',
    bgColor: '#f0f5f5',
    headerBg: '#0D4F4F',
  },
  imagery: {
    label: 'SAIKI IMAGERY',
    logo: '/brand/SAIKI IMAGERY.svg',
    logoWhite: '/brand/SAIKI-IMAGERY-WHITE-01.svg',
    color: '#1a1a2e',
    bgColor: '#f0f0f5',
    headerBg: '#1a1a2e',
  },
};

export function formatCurrency(amount: number, currency = 'IDR'): string {
  if (currency === 'IDR') {
    return `Rp${amount.toLocaleString('id-ID')}`;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function generateVerificationToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export function generateInvoiceNumber(brand: ServiceBrand, sequence?: number): string {
  const brandCode = { consultancy: 'SC', technology: 'ST', imagery: 'SI' }[brand];
  const year = new Date().getFullYear();
  const seq = sequence ? String(sequence).padStart(3, '0') : '001';
  return `INV${seq}-${brandCode}-${year}`;
}

export function generateReceiptNumber(brand: ServiceBrand, sequence?: number): string {
  const brandCode = { consultancy: 'SC', technology: 'ST', imagery: 'SI' }[brand];
  const year = new Date().getFullYear();
  const seq = sequence ? String(sequence).padStart(3, '0') : '001';
  return `RCP.${seq}-${brandCode}-${year}`;
}

export function numberToWords(num: number): string {
  if (num === 0) return 'Zero Rupiah';

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

  function convertGroup(n: number): string {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convertGroup(n % 100) : '');
  }

  const parts: string[] = [];
  let scaleIndex = 0;
  let remaining = Math.floor(num);

  while (remaining > 0) {
    const group = remaining % 1000;
    if (group > 0) {
      const groupStr = convertGroup(group);
      parts.unshift(scales[scaleIndex] ? `${groupStr} ${scales[scaleIndex]}` : groupStr);
    }
    remaining = Math.floor(remaining / 1000);
    scaleIndex++;
  }

  return parts.join(' ') + ' Rupiah';
}
