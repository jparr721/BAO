import { Request, Response, NextFunction } from "express";

// Define a type for Express route handlers
type ExpressFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any> | void;

export default ExpressFn;
