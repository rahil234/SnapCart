import { Request, Response, Router } from 'express';

const adminRoute = Router();

adminRoute.get('/', (req: Request, res: Response) => {
  res.send('admin Route');
});

export default adminRoute;
