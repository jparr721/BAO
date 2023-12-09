import { Router } from "express";
import { getMeshByName, getAllMeshes } from "../controllers/mesh";
import unrollError from "../middleware/unroll-error";

export default (): Router => {
  const router = Router();
  router.get("/", unrollError(getAllMeshes));
  router.get("/:name", unrollError(getMeshByName));
  return router;
};
