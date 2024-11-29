import axiosInstance from './axiosInstance';

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
  const report = (
    await axiosInstance.get(
      `/api/sales?tf=${timeframe}&sd=${startDate}&ed=${endDate}`
    )
  ).data;
  console.log('report ', report);
  return report;
};

const SalesData = async () => {
  const response = await axiosInstance.get('/orders');
  return response.data;
};

export default { fetchSalesData, SalesData };
