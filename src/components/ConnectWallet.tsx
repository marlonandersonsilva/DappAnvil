import React from 'react';
import { Wallet } from 'lucide-react';

interface ConnectWalletProps {
  account: string;
  connectWallet: () => Promise<void>;
  isLoading: boolean;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ 
  account, 
  connectWallet,
  isLoading
}) => {
  return (
    <div>
      {account ? (
        <div className="flex items-center bg-gray-800/70 rounded-lg px-4 py-2 border border-gray-700">
          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm font-medium">
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isLoading}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          <Wallet className="h-4 w-4 mr-2" />
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;