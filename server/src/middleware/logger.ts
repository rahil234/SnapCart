import { Request, Response, NextFunction } from 'express';

const logger = () => (req: Request, _res: Response, next: NextFunction) => {
  const currentTime = `${new Date().toLocaleTimeString('en-US', { hour12: false })}.${new Date().getMilliseconds()}`;
  const method = req.method;
  const url = req.url;

  console.log(`${currentTime} ${method}: ${url}`);
  next();
};

export default logger;
