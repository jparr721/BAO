import { Router } from "express";
import { runSimulation } from "../controllers/sim";
import unrollError from "../unroll-error";

export default (): Router => {
  const router = Router();
  router.post("/", unrollError(runSimulation));
  return router;
};
