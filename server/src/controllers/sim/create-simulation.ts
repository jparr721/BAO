import { ok } from "../http-response";
import { Response } from "express";
import MutationRequest from "../mutation-request";
import CreateSimulation from "./create-simulation.type";
import { useSimCache } from "../../simulation/simulation-cache";
import Simulation from "../../simulation/simulation";

export default async function createSimulation(
  req: MutationRequest<CreateSimulation>,
  res: Response
) {
  const [cache, addSimulationToCache] = useSimCache();

  addSimulationToCache(
    req.body.simulationName,
    Simulation.fromOptions(req.body)
  );

  ok(res, { cache: cache.toString() });
}
