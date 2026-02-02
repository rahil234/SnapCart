import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { Plus, ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { AuthState } from '@/features/auth/authSlice';
import { WalletService } from '@/services/wallet.service';
import AddFundsComponent from '@/components/user/addWalletFundCard';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Transaction {
  _id: string;
  userId: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  // date: string;
}

export default function WalletSection() {
  const [balance, setBalance] = useState(256);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddFundsDialogOpen, setIsAddFundsDialogOpen] = useState(false);

  const user = useSelector((state: { auth: AuthState }) => state.auth.user);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        setIsLoading(true);
        const balanceResponse = await WalletService.getBalance();
        const transactionsResponse = await WalletService.getTransactions();
        console.log(transactionsResponse.transactions);
        setBalance(balanceResponse.balance);
        setTransactions(transactionsResponse.transactions);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch wallet data:', error);
        setError('Failed to fetch wallet data');
        setIsLoading(false);
      }
    })();
  }, [user]);

  const handleAddFunds = async (amount: number) => {
    try {
      const response = await WalletService.addFunds(amount);
      setBalance(response.data.newBalance);
      setTransactions([response.data.transactions, ...transactions]);
      setIsAddFundsDialogOpen(false);
    } catch (error) {
      console.error('Failed to add funds:', error);
      setError('Failed to add funds. Please try again.');
      alert('Failed to add funds. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading wallet data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
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
              <p className="text-4xl font-bold mt-1">₹{balance.toFixed(2)}</p>
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
                <AddFundsComponent onAddFunds={handleAddFunds} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500">No transactions yet.</p>
          ) : (
            <ul className="space-y-4">
              {transactions.map(transaction => (
                <li
                  key={transaction._id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center">
                    {transaction.type === 'credit' ? (
                      <ArrowUpRight className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownLeft className="mr-2 h-4 w-4 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      {/*<p className="text-sm text-gray-500">*/}
                      {/*  {format(new Date(transaction.date), 'PPp')}*/}
                      {/*</p>*/}
                    </div>
                  </div>
                  <p
                    className={`font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {transaction.type === 'credit' ? '+' : '-'}₹
                    {transaction.amount.toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
