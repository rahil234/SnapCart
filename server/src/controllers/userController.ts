import { Request, Response } from 'express';

const login = (req: Request, res: Response) => {
  res.json({ message: 'Hello from login controller' });
};

const signup = (req: Request, res: Response) => {
  res.json({ message: 'Hello from signup controller' });
};

export default { login, signup };
