import { Request, Response, Router } from 'express';

const sellerRoute = Router();

sellerRoute.get('/', (req: Request, res: Response) => {
  res.send('Seller Route');
});

export default sellerRoute;
