import { Request, Response } from 'express';
import SalesService from '@/utils/GenerateSalesReport';
import { catchError } from '@shared/types';

// const getSalesData = async (req: Request, res: Response) => {
//   try {
//     const salesData = await SalesService.getSalesData();
//     res.status(200).json(salesData);
//   } catch (error) {
//     res.status(500).json({ message: 'Error retrieving sales data', error });
//   }
// };

const fetchSalesReport = async (req: Request, res: Response) => {
  try {
    const { tf, sd, ed } = req.query as {
      tf?: string;
      sd?: string;
      ed?: string;
    };

    if (req.user?._id === undefined) {
      throw new Error('User not found');
    }

    const salesReport = await SalesService(req.user?._id, tf, sd, ed);
    res.status(200).json({ report: salesReport });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as catchError).message });
  }
};

export default { fetchSalesReport };
