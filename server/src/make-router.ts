import { Express } from "express";
import HealthRouter from "./routes/healthz";
import MeshRouter from "./routes/mesh";
import SimRouter from "./routes/sim";
import logger from "./logger";

function logRoutes(app: Express) {
  const routes = [];
  function processStack(stack, basePath = "") {
    stack.forEach((middleware) => {
      if (middleware.route) {
        // Direct route
        const path = basePath + middleware.route.path;
        const methods = middleware.route.methods;
        Object.keys(methods).forEach((method) => {
          if (methods[method]) {
            routes.push({ method: method.toUpperCase(), path });
          }
        });
      } else if (
        middleware.name === "router" ||
        middleware.name === "bound dispatch"
      ) {
        // Router
        let newPath = basePath;
        if (middleware.regexp.source !== "^\\/?$") {
          newPath += "/" + middleware.regexp.source;
        }
        processStack(middleware.handle.stack, newPath);
      }
    });
  }

  processStack(app._router.stack);

  routes.forEach((route) => logger.info(route));
}

export default function makeApiRouter(app: Express) {
  app.use("/healthz", HealthRouter());
  app.use("/mesh", MeshRouter());
  app.use("/sim", SimRouter());
  logRoutes(app);
  return app;
}
