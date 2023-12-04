import { Response } from "express";

export enum HttpStatusCode {
  OK = 200,
  Created = 201,
  NoContent = 204,
}

const httpResponse =
  (statusCode: HttpStatusCode) =>
  <T extends Record<string, any> = {}>(res: Response, data?: T) => {
    const payload = {
      success: statusCode >= 200 && statusCode < 300,
      data,
    };
    res.status(statusCode).json(payload);
  };

export const ok = httpResponse(HttpStatusCode.OK);
export const created = httpResponse(HttpStatusCode.Created);
export const noContent = httpResponse(HttpStatusCode.NoContent);
