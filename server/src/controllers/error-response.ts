import { Response } from "express";
import logger from "../logger";

export enum HttpStatusCode {
  NotFound = 404,
  BadRequest = 400,
  InternalServerError = 500,
}

export const errorResponse =
  (code: HttpStatusCode) =>
  <T extends Record<string, any> = {}>(
    res: Response,
    message: string,
    context?: string,
    debug?: T
  ) => {
    const payload = {
      error: true,
      code,
      message,
      context: context || "N/A", // Default value if context is not provided
      debug,
    };

    logger.error(JSON.stringify(payload));

    res.status(code).json(payload);
  };

export const errorNotFound = errorResponse(HttpStatusCode.NotFound);
export const errorBadRequest = errorResponse(HttpStatusCode.BadRequest);
export const errorInternalServerError = errorResponse(
  HttpStatusCode.InternalServerError
);
