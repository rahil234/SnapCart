import { Request, Response, Router } from 'express';

const adminRoute = Router();

adminRoute.get('/', (req: Request, res: Response) => {
  res.send('admin Route');
});

adminRoute.post('/login', (req: Request, res: Response) => {
  console.log(req.body);
  res.send('admin Route');
});

export default adminRoute;
