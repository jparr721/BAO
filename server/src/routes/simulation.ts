import { Router } from "express";
import { runSimulation } from "../controllers/simulation/sim";
import createSimulation from "../controllers/simulation/create-simulation";
import unrollError from "../middleware/unroll-error";
import validatePayload from "../middleware/validate-payload";
import CreateSimulation from "../controllers/simulation/create-simulation.type";
import getSimulationCache from "../controllers/simulation/get-simulation-cache";

export default (): Router => {
  const router = Router();
  router.get("/materials");
  router.get("/simulation-cache", unrollError(getSimulationCache));
  router.post("/", unrollError(runSimulation));
  router.post(
    "/create",
    validatePayload(CreateSimulation),
    unrollError(createSimulation)
  );
  return router;
};
