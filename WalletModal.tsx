
import React, { useState } from 'react';
import { User, Transaction, TransactionType } from '../types';
import { XCircleIcon, WalletIcon, ArrowUpCircleIcon, ArrowDownCircleIcon, BanknotesIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  transactions: Transaction[];
  onFundWallet: (amount: number) => void;
}

const TransactionIcon: React.FC<{ type: TransactionType }> = ({ type }) => {
    switch(type) {
        case TransactionType.FUND:
            return <BanknotesIcon className="w-5 h-5 text-green-500" />;
        case TransactionType.SALE:
            return <ArrowUpCircleIcon className="w-5 h-5 text-green-500" />;
        case TransactionType.PURCHASE:
            return <ArrowDownCircleIcon className="w-5 h-5 text-red-500" />;
        case TransactionType.WITHDRAWAL:
             return <ArrowDownCircleIcon className="w-5 h-5 text-red-500" />;
        default:
            return <WalletIcon className="w-5 h-5 text-gray-500" />;
    }
};


const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, currentUser, transactions, onFundWallet }) => {
  const [fundAmount, setFundAmount] = useState<number | ''>('');

  if (!isOpen) return null;

  const handleFundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fundAmount && fundAmount > 0) {
      onFundWallet(fundAmount);
      setFundAmount('');
    }
  };
  
  const sortedTransactions = [...transactions].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-75 flex items-center justify-center p-4 z-[80] transition-opacity duration-300 ease-in-out" role="dialog" aria-modal="true" aria-labelledby="wallet-modal-title">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 ease-in-out scale-100 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 id="wallet-modal-title" className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <WalletIcon className="w-6 h-6 mr-2 text-green-500 dark:text-green-400" />
            My Wallet
          </h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" aria-label="Close modal">
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Balance</p>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400">₦{currentUser.walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <form onSubmit={handleFundSubmit} className="mt-4 flex items-end space-x-2">
                <div className="flex-grow">
                    <label htmlFor="fundAmount" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Add Funds (Mock)</label>
                    <input 
                        type="number" 
                        id="fundAmount" 
                        value={fundAmount} 
                        onChange={e => setFundAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                        min="1"
                        placeholder="Enter amount"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm"
                    />
                </div>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm disabled:opacity-50" disabled={!fundAmount || fundAmount <= 0}>
                    Fund
                </button>
            </form>
        </div>

        <div className="flex-grow overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Transaction History</h3>
            {sortedTransactions.length > 0 ? (
                <ul className="space-y-3">
                    {sortedTransactions.map(tx => {
                        const isCredit = tx.type === TransactionType.FUND || tx.type === TransactionType.SALE;
                        return (
                            <li key={tx.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                <div className="flex items-center">
                                    <div className="mr-3 flex-shrink-0">
                                        <TransactionIcon type={tx.type} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{tx.description}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(tx.timestamp).toLocaleString()}
                                            {tx.counterpartyName && ` - ${isCredit ? 'From' : 'To'}: ${tx.counterpartyName}`}
                                        </p>
                                    </div>
                                </div>
                                <p className={`text-sm font-semibold ${isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {isCredit ? '+' : '-'}₦{tx.amount.toLocaleString()}
                                </p>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="text-center py-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">No transactions yet.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
