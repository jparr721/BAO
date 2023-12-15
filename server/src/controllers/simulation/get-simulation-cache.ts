import { Request, Response } from "express";
import { useSimCache } from "../../simulation/simulation-cache";
import { ok } from "../http-response";

export default async function getSimulationCache(req: Request, res: Response) {
  const [cache, _] = useSimCache();
  ok(res, { cache: cache.toJSON() });
}
