import { Router } from "express";
import { runSimulation } from "../controllers/sim/sim";
import createSimulation from "../controllers/sim/create-simulation";
import unrollError from "../middleware/unroll-error";
import validatePayload from "../middleware/validate-payload";
import CreateSimulation from "../controllers/sim/create-simulation.type";

export default (): Router => {
  const router = Router();
  router.get("/materials");
  router.post("/", unrollError(runSimulation));
  router.post(
    "/create",
    validatePayload(CreateSimulation),
    unrollError(createSimulation)
  );
  return router;
};
