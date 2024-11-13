import axiosInstance from './axiosInstance';

const getBalance = () => {
  return axiosInstance.get('/api/wallet');
};

const getTransactions = () => {
  return axiosInstance.get('/api/wallet/transactions');
};

const addFunds = (amount: number) => {
  return axiosInstance.post('/api/wallet/add-funds', { amount });
};

export default { getBalance, getTransactions, addFunds };
