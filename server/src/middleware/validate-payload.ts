import { Request, Response, NextFunction } from "express";
import ExpressFn from "./express-fn";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";

const validatePayload =
  <Schema extends ClassConstructor<any>>(
    schema: Schema,
    fn: ExpressFn
  ): ExpressFn =>
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    return Promise.resolve(validateOrReject(plainToInstance(schema, req.body)))
      .then(() => next(fn(req, res, next)))
      .catch((err) => next(err));
  };

export default validatePayload;
