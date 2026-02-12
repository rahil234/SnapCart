import {
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  Plus,
  RefreshCw,
  RotateCcw,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  addMoneyToWallet,
  fetchTransactions,
  fetchWallet,
} from '@/store/wallet/walletSlice';
import { Button } from '@/components/ui/button';
import { RootState, useAppDispatch } from '@/store/store';
import AddFundsComponent from '@/components/user/addWalletFundCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WalletSection() {
  const dispatch = useAppDispatch();
  const [isAddFundsDialogOpen, setIsAddFundsDialogOpen] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);
  const {
    wallet,
    transactions,
    totalTransactions,
    status,
    transactionsStatus,
  } = useSelector((state: RootState) => state.wallet);

  useEffect(() => {
    if (user) {
      dispatch(fetchWallet());
      dispatch(fetchTransactions({ limit: 20, offset: 0 }));
    }
  }, [user, dispatch]);

  const handleAddFunds = async (amount: number) => {
    try {
      await dispatch(
        addMoneyToWallet({ amount, description: 'Added money via dashboard' })
      ).unwrap();
      toast.success(`₹${amount} added to wallet successfully!`);
      dispatch(fetchTransactions({ limit: 20, offset: 0 }));
      setIsAddFundsDialogOpen(false);
    } catch (error) {
      toast.error(
        (error as string) || 'Failed to add funds. Please try again.'
      );
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'credit':
        return <ArrowUpRight className="mr-2 h-4 w-4 text-green-500" />;
      case 'debit':
        return <ArrowDownLeft className="mr-2 h-4 w-4 text-red-500" />;
      case 'refund':
        return <RotateCcw className="mr-2 h-4 w-4 text-blue-500" />;
      case 'cashback':
        return <Gift className="mr-2 h-4 w-4 text-purple-500" />;
      default:
        return <ArrowUpRight className="mr-2 h-4 w-4 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'credit':
      case 'refund':
      case 'cashback':
        return 'text-green-600';
      case 'debit':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const isCredit = (type: string) => {
    return ['credit', 'refund', 'cashback'].includes(type);
  };

  if (status === 'loading' && !wallet) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-6 w-6 animate-spin text-indigo-600" />
        <span className="ml-2">Loading wallet data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            <Wallet className="mr-2 h-6 w-6" />
            My Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-80">Current Balance</p>
              <p className="text-4xl font-bold mt-1">
                ₹{wallet?.balance?.toFixed(2) ?? '0.00'}
              </p>
              {wallet && (
                <p className="text-xs opacity-60 mt-1">
                  Currency: {wallet.currency}
                </p>
              )}
            </div>
            <Dialog
              open={isAddFundsDialogOpen}
              onOpenChange={setIsAddFundsDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="bg-white text-indigo-600 hover:bg-gray-100"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Funds
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Money to Wallet</DialogTitle>
                </DialogHeader>
                <AddFundsComponent onAddFunds={handleAddFunds} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transaction History</CardTitle>
          {totalTransactions > 0 && (
            <span className="text-sm text-gray-500">
              {totalTransactions} transaction
              {totalTransactions !== 1 ? 's' : ''}
            </span>
          )}
        </CardHeader>
        <CardContent>
          {transactionsStatus === 'loading' ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No transactions yet. Add funds to get started!
            </p>
          ) : (
            <ul className="space-y-4">
              {transactions.map(transaction => (
                <li
                  key={transaction.id}
                  className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <p className="font-medium">
                        {transaction.description ||
                          transaction.type.charAt(0).toUpperCase() +
                            transaction.type.slice(1)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(transaction.createdAt), 'PPp')}
                      </p>
                      {transaction.orderId && (
                        <p className="text-xs text-gray-400">
                          Order: {transaction.orderId.substring(0, 8)}...
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${getTransactionColor(transaction.type)}`}
                    >
                      {isCredit(transaction.type) ? '+' : '-'}₹
                      {transaction.amount.toFixed(2)}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : transaction.status === 'failed'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
