import axiosInstance from './axiosInstance';

export const mockSalesData = [
    { id: 1, date: '2023-05-01', product: 'Widget A', quantity: 50, revenue: 2500 },
    { id: 2, date: '2023-05-02', product: 'Gadget B', quantity: 30, revenue: 1800 },
    { id: 3, date: '2023-05-03', product: 'Doohickey C', quantity: 20, revenue: 1000 },
    { id: 4, date: '2023-05-04', product: 'Widget A', quantity: 40, revenue: 2000 },
    { id: 5, date: '2023-05-05', product: 'Gadget B', quantity: 25, revenue: 1500 },
  ];

// const fetchSalesData = async () => {
//   const response = await axiosInstance.get('/orders');
//   return response.data;
// };

export interface SalesData {
    id: number;
    date: string;
    product: string;
    quantity: number;
    revenue: number;
  }
  
  export async function fetchSalesData(): Promise<SalesData[]> {
    // In a real application, this would be an API call
    // For this example, we'll simulate an API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockSalesData);
      }, 1000);
    });
  }

const SalesData = async () => {
  const response = await axiosInstance.get('/orders');
  return response.data;
};

export default { fetchSalesData, SalesData };
