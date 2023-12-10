import { ok } from "../http-response";
import { Response } from "express";
import MutationRequest from "../mutation-request";
import CreateSimulation from "./create-simulation.type";

export default async function createSimulation(
  req: MutationRequest<CreateSimulation>,
  res: Response
) {
  ok(res, req.body);
}
