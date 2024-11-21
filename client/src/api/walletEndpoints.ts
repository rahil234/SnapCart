import axiosInstance from './axiosInstance';

const getBalance = async () => {
  return (await axiosInstance.get('/api/wallet')).data;
};

const getTransactions = async () => {
  return (await axiosInstance.get('/api/wallet/transactions')).data;
};

const addFunds = async (amount: number) => {
  return axiosInstance.post('/api/wallet/add-funds', { amount });
};

export default { getBalance, getTransactions, addFunds };
