import { Request, Response, NextFunction } from "express";

// Define a type for Express route handlers
type ExpressRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any> | void;

// Use the ExpressRouteHandler type for the 'fn' parameter
const unrollError =
  (fn: ExpressRouteHandler): ExpressRouteHandler =>
  (req: Request, res: Response, next: NextFunction): Promise<any> =>
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));

export default unrollError;
