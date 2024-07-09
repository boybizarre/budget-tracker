export type Option = {
  value: string;
  label: string;
  locale?: string;
};

export type TransactionType = 'income' | 'expense';
export type TimeFrame = 'month' | 'year';
export type Period = { year: number; month: number };