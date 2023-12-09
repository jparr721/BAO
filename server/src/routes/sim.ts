import { Router } from "express";
import { createSimulation, runSimulation } from "../controllers/sim/sim";
import unrollError from "../middleware/unroll-error";
import validatePayload from "../middleware/validate-payload";
import CreateSimulation from "../controllers/sim/create-simulation.type";

export default (): Router => {
  const router = Router();
  router.post("/", unrollError(runSimulation));
  router.post(
    "/create",
    validatePayload(CreateSimulation, unrollError(createSimulation))
  );
  return router;
};
