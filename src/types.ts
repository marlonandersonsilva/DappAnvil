export interface TransactionType {
  hash: string;
  from: string;
  to: string;
  amount: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

declare global {
  interface Window {
    ethereum: any;
  }
}