import axios from './axios';

const getBalance = async () => {
  return (await axios.get('/api/wallet')).data;
};

const getTransactions = async () => {
  return (await axios.get('/api/wallet/transactions')).data;
};

const addFunds = async (amount: number) => {
  return axios.post('/api/wallet/add-funds', { amount });
};

export default { getBalance, getTransactions, addFunds };
