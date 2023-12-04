import { Router } from "express";
import { get } from "../controllers/healthz";

export default (): Router => {
  const router = Router();
  router.get("/", get);
  return router;
};
