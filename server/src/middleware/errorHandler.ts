import { ErrorRequestHandler } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

export default errorHandler;