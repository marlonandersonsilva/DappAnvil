import React from 'react';
import { Coins } from 'lucide-react';

interface TokenBalanceProps {
  balance: string;
}

const TokenBalance: React.FC<TokenBalanceProps> = ({ balance }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-6 border border-blue-500/30">
      <div className="flex items-center mb-4">
        <Coins className="h-6 w-6 text-blue-400 mr-2" />
        <h3 className="text-lg font-medium">Token Balance</h3>
      </div>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold">{parseFloat(balance).toFixed(2)}</span>
        <span className="ml-2 text-gray-400">AVL</span>
      </div>
      <div className="mt-4 text-sm text-gray-400">
        AnvilToken (AVL)
      </div>
    </div>
  );
};

export default TokenBalance;