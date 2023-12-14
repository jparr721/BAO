import { Request, Response, NextFunction } from "express";
import { DotenvVariable, dotenvValue } from "../src/dotenv";
import initializeApp from "../src/initialize-app";
import logger from "../src/logger";
import makeApiRouter from "../src/make-router";
import { errorResponse } from "../src/controllers/error-response";

const customErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(JSON.stringify(err, null, 2));
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  const debugPayload = {
    err,
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
    stackTrace: err.stack,
  };

  errorResponse(statusCode)(res, message, "customErrorHandler", debugPayload);
};

export default async function start() {
  const initApp = initializeApp();
  const port = dotenvValue(DotenvVariable.NodePort, "3000");
  const app = makeApiRouter(initApp);
  app.use(customErrorHandler);

  return app.listen(port, () => logger.info(`Running on port ${port}`));
}

start().catch((e) => logger.error(e.message));
