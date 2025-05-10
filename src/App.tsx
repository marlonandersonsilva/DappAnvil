import  { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Wallet, Coins, ArrowRightLeft, LayoutDashboard, History, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import ConnectWallet from './components/ConnectWallet';
import TokenBalance from './components/TokenBalance';
import TransferForm from './components/TransferForm';
import TransactionHistory from './components/TransactionHistory';
import tokenAbi from './abis/Token.json';
import { TransactionType } from './types';

function App() {
  const [account, setAccount] = useState<string>('');
  //const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // Token contract address - this will be updated by the deployment script
  const tokenAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

  const initializeContract = async (signer: ethers.JsonRpcSigner) => {
    try {
      const contract = new ethers.Contract(tokenAddress, tokenAbi, signer);
      setTokenContract(contract);
      
      // Verify contract is deployed by calling a view function
      await contract.symbol();
      return contract;
    } catch (error) {
      console.error("Error initializing contract:", error);
      setError("Contract not found. Please ensure the contract is deployed and the address is correct.");
      return null;
    }
  };

  const updateBalance = async (contract: ethers.Contract, address: string) => {
    try {
      const balance = await contract.balanceOf(address);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Error fetching balance:", error);
      setError("Error fetching token balance. Please try again.");
    }
  };
  const disconnectWallet = () => {
    setAccount('');
    setSigner(null);
    setTokenContract(null);
    setBalance('0');
    setTransactions([]);
    setError(null);
    console.log("Wallet disconnected");
  };


  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          //setProvider(provider);
          
          const accounts = await provider.send("eth_accounts", []);
          
          if (accounts.length > 0) {
            const account = accounts[0];
            setAccount(account);
            
            const signer = await provider.getSigner();
            setSigner(signer);
            
            const contract = await initializeContract(signer);
            if (contract) {
              await updateBalance(contract, account);
            }
          }
        } else {
          setError("Please install MetaMask to use this DApp");
        }
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        setError("Error connecting to wallet. Is Anvil running?");
      }
    };

    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    if (isConnecting || isLoading) {
      console.log("Connection already in progress");
      return;
    }
    
    try {
      setIsConnecting(true);
      setIsLoading(true);
      setError(null);
      
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to use this DApp");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      //setProvider(provider);
      
      // Request accounts
      const accounts = await provider.send("eth_requestAccounts", []);
      const account = accounts[0];
      setAccount(account);
      
      const signer = await provider.getSigner();
      setSigner(signer);
      
      const contract = await initializeContract(signer);
      if (contract) {
        await updateBalance(contract, account);
      }
    } catch (error: any) {
      console.error("Error connecting to wallet:", error);
      setError(error.message || "Error connecting to wallet. Please try again.");
    } finally {
      setIsLoading(false);
      setIsConnecting(false);
    }
  };

  const transferTokens = async (to: string, amount: string) => {
    if (!tokenContract || !signer) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const parsedAmount = ethers.parseEther(amount);
      const tx = await tokenContract.transfer(to, parsedAmount);
      
      // Add to transactions
      const newTx: TransactionType = {
        hash: tx.hash,
        from: account,
        to: to,
        amount: amount,
        timestamp: Date.now(),
        status: 'pending'
      };
      
      setTransactions([newTx, ...transactions]);
      
      // Wait for transaction to be mined
      await tx.wait();
      
      // Update transaction status
      setTransactions(prevTxs => 
        prevTxs.map(t => 
          t.hash === tx.hash ? { ...t, status: 'confirmed' } : t
        )
      );
      
      // Update balance
      await updateBalance(tokenContract, account);
    } catch (error) {
      console.error("Error transferring tokens:", error);
      setError("Error transferring tokens. Please try again.");
      
      // Update transaction status if it exists
      if (transactions.length > 0 && transactions[0].status === 'pending') {
        setTransactions(prevTxs => 
          prevTxs.map((t, i) => 
            i === 0 ? { ...t, status: 'failed' } : t
          )
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <Coins className="h-8 w-8 text-blue-500 mr-2" />
            <h1 className="text-2xl font-bold">Anvil DApp</h1>
          </div>
          <div className="flex items-center space-x-4">
          {account && (
            <button
        onClick={disconnectWallet}
        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Disconnect
           </button>
    )}
          <ConnectWallet 
            account={account} 
            connectWallet={connectWallet} 
            isLoading={isLoading || isConnecting} 
          />
          </div>
        </header>

        {error && (
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeTab === 'dashboard' 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-gray-700/50 text-gray-300'
                }`}
              >
                <LayoutDashboard className="h-5 w-5 mr-3" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('transfer')}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeTab === 'transfer' 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-gray-700/50 text-gray-300'
                }`}
              >
                <ArrowRightLeft className="h-5 w-5 mr-3" />
                Transfer Tokens
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeTab === 'history' 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-gray-700/50 text-gray-300'
                }`}
              >
                <History className="h-5 w-5 mr-3" />
                Transaction History
              </button>
            </nav>
          </div>

          <div className="lg:col-span-3 bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            {!account ? (
              <div className="text-center py-12">
                <Wallet className="h-16 w-16 mx-auto text-gray-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
                <p className="text-gray-400 mb-6">Connect your wallet to interact with the Anvil blockchain</p>
                <button
                  onClick={connectWallet}
                  disabled={isLoading || isConnecting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading || isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Dashboard</h2>
                    <TokenBalance balance={balance} />
                    
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
                      {transactions.length > 0 ? (
                        <div className="space-y-4">
                          {transactions.slice(0, 3).map((tx, index) => (
                            <div key={index} className="bg-gray-700/30 rounded-lg p-4 border border-gray-700">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  {tx.status === 'confirmed' && <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />}
                                  {tx.status === 'pending' && <History className="h-5 w-5 text-yellow-500 mr-2" />}
                                  {tx.status === 'failed' && <XCircle className="h-5 w-5 text-red-500 mr-2" />}
                                  <span className="font-medium">
                                    {tx.status === 'confirmed' ? 'Confirmed' : tx.status === 'pending' ? 'Pending' : 'Failed'}
                                  </span>
                                </div>
                                <span className="text-sm text-gray-400">
                                  {new Date(tx.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <div className="text-sm text-gray-300 truncate">
                                To: {tx.to}
                              </div>
                              <div className="text-sm font-medium mt-1">
                                Amount: {tx.amount} AVL
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400">No transactions yet</p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'transfer' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Transfer Tokens</h2>
                    <TransferForm 
                      transferTokens={transferTokens} 
                      isLoading={isLoading} 
                    />
                  </div>
                )}

                {activeTab === 'history' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Transaction History</h2>
                    <TransactionHistory transactions={transactions} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;