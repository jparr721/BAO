import express, { Request, Express, Response, json, urlencoded } from "express";

// parse cookies from browser requests
import cookieParser from "cookie-parser";

// cross-origin resource sharing
import cors from "cors";

// request logging
import morgan from "morgan";

// security
import helmet from "helmet";

// gzip compression
import compression from "compression";

// side-effect for dotenv
import "./dotenv";

// validation
import { errors } from "celebrate";

function customLogFormat(tokens: any, req: Request, res: Response) {
  return JSON.stringify({
    app_name: "BAO",
    timestamp: tokens.date(req, res, "clf"),
    request_ip: tokens["remote-addr"](req, res),
    request_user: tokens["remote-user"](req, res),
    request_method: tokens.method(req, res),
    request: tokens.url(req, res),
    response_status: tokens.status(req, res),
    request_bytes_sent: tokens.res(req, res, "content-length"),
    http_referrer: tokens.referrer(req, res),
    request_user_agent: tokens["response-time"](req, res),
    response_time: tokens["response-time"](req, res),
    request_id: req.headers["x-request-id"],
    server_name: req.headers.host,
    ui_app_name: req.get("AppName"),
    ui_app_version: req.get("AppVersion"),
    ui_app_platform: req.get("AppPlatform"),
  });
}

export default function initializeApp(): Express {
  const app = express();

  // obfuscate server information
  app.disable("x-powered-by");

  // only allow exact matches in routes
  app.enable("strict-routing");
  app.enable("case sensitive routing");

  [
    () => json(),
    () => urlencoded({ extended: false, limit: "5mb" }),
    () => morgan(customLogFormat),
    () => compression(),
    () => cookieParser(),
    () => cors(),
    () => helmet(),
    () => errors(),
  ].forEach((m) => app.use(m()));

  return app;
}
