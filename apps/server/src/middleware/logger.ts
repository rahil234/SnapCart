import { Request, Response, NextFunction } from 'express';

const logger = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = new Date();

    res.on('finish', () => {
      const time = `${start.toLocaleTimeString('en-US', {
        hour12: false,
      })}.${start.getMilliseconds()}`;

      console.log(
        `${time} ${req.method}:${req.originalUrl}` + ` ${res.statusCode}`
      );
    });

    next();
  };
};

export default logger;
