import React, { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';

interface TransferFormProps {
  transferTokens: (to: string, amount: string) => Promise<void>;
  isLoading: boolean;
}

const TransferForm: React.FC<TransferFormProps> = ({ 
  transferTokens,
  isLoading
}) => {
  const [to, setTo] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!to) {
      setFormError('Please enter a recipient address');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setFormError('Please enter a valid amount');
      return;
    }
    
    setFormError(null);
    await transferTokens(to, amount);
    
    // Reset form after successful transfer
    setTo('');
    setAmount('');
  };

  return (
    <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-700">
      <form onSubmit={handleSubmit}>
        {formError && (
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-3 mb-4 text-sm">
            {formError}
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="to" className="block text-sm font-medium text-gray-300 mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            id="to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="0x..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              step="0.01"
              min="0"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-16"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-400">AVL</span>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
        >
          {isLoading ? (
            'Processing...'
          ) : (
            <>
              <ArrowRightLeft className="h-5 w-5 mr-2" />
              Transfer Tokens
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TransferForm;