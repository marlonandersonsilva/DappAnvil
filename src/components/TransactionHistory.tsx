import React from 'react';
import { CheckCircle2, XCircle, History as HistoryIcon, ExternalLink } from 'lucide-react';
import { TransactionType } from '../types';

interface TransactionHistoryProps {
  transactions: TransactionType[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <HistoryIcon className="h-12 w-12 mx-auto text-gray-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">No Transactions Yet</h3>
        <p className="text-gray-400">Your transaction history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((tx, index) => (
        <div key={index} className="bg-gray-700/30 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              {tx.status === 'confirmed' && <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />}
              {tx.status === 'pending' && <HistoryIcon className="h-5 w-5 text-yellow-500 mr-2" />}
              {tx.status === 'failed' && <XCircle className="h-5 w-5 text-red-500 mr-2" />}
              <span className={`font-medium ${
                tx.status === 'confirmed' ? 'text-green-400' : 
                tx.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {tx.status === 'confirmed' ? 'Confirmed' : tx.status === 'pending' ? 'Pending' : 'Failed'}
              </span>
            </div>
            <span className="text-sm text-gray-400">
              {new Date(tx.timestamp).toLocaleString()}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">From</div>
              <div className="text-sm text-gray-300 truncate">{tx.from}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">To</div>
              <div className="text-sm text-gray-300 truncate">{tx.to}</div>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="text-sm text-gray-400 mb-1">Amount</div>
            <div className="text-lg font-medium">{tx.amount} AVL</div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between items-center">
            <div className="text-sm text-gray-400">
              Tx: {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
            </div>
            <a 
              href={`https://etherscan.io/tx/${tx.hash}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 flex items-center text-sm"
            >
              View <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionHistory;