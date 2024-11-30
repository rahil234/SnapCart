import { Request, Response } from 'express';
import SalesService from '@/utils/GenerateSalesReport';
import { catchError } from '@shared/types';

const fetchSalesReport = async (req: Request, res: Response) => {
  try {
    const { tf, sd, ed } = req.query as {
      tf?: string;
      sd?: string;
      ed?: string;
    };

    if (!req.user?._id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const salesReport = await SalesService(
      tf,
      sd,
      ed,
      req.user.role === 'seller' ? req.user?._id : undefined
    );
    res.status(200).json(salesReport);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as catchError).message });
  }
};

export default { fetchSalesReport };
