import axios from './axios';

export interface SalesData {
  id: number;
  date: string;
  product: string;
  quantity: number;
  revenue: number;
}

const fetchSalesData = async (
  timeframe: string,
  startDate: string,
  endDate: string
) => {
  return (
    await axios.get(
      `/api/sales?tf=${timeframe}&sd=${startDate}&ed=${endDate}`
    )
  ).data;
};

const SalesData = async () => {
  const response = await axios.get('/orders');
  return response.data;
};

export default { fetchSalesData, SalesData };
