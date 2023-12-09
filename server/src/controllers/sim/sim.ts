import { Request, Response } from "express";
import readTriangles2D from "../../geometry/read-triangles-2d";
import { join } from "path";
import { ok } from "../http-response";
import Vector from "../../linear-algebra/vector";
import TriangleMesh from "../../geometry/triangle-mesh";
import STVK from "../../material/stvk";
import ForwardEulerArea from "../../integrator/forward-euler-area";
import SNH from "../../material/snh";
import { computeLambda, computeMu } from "../../material/material";
import { useSimCache } from "../../simulation/sim-cache";
import CreateSimulation from "./create-simulation.type";
import { validateOrReject } from "class-validator";
import logger from "../../logger";
import MutationRequest from "../mutation-request";

export async function createSimulation(
  req: MutationRequest<CreateSimulation>,
  res: Response
) {
  ok(res, req.body);
}

export async function runSimulation(req: Request, res: Response) {
  const { vertices, triangles } = readTriangles2D(
    join(import.meta.dir, "..", "..", "/meshes/bunny/bunny.1")
  );

  const mesh = new TriangleMesh(vertices, triangles, 5 /* uniformMass */);
  const pinned = mesh.vertices.map((v) => v.y > 0.4);
  mesh.pinnedVertices = pinned;

  const poissionsRatio = 0.45;
  const youngsModulus = 5.0;
  const lambda = computeLambda(youngsModulus, poissionsRatio);
  const mu = computeMu(youngsModulus, poissionsRatio);

  const material = new SNH(lambda, mu);
  const integrator = new ForwardEulerArea(mesh, material, 1.0 / 100.0);
  integrator.addGravity(Vector.fromArray([0.0, -1.0]));

  const responsePayload: {
    frames: { vertices: number[]; indices: number[] }[];
  } = {
    frames: [],
  };

  let v = integrator.mesh.vertices.map((v) => v.values).flat();
  let i = integrator.mesh.triangles.map((v) => v.values).flat();

  for (let idx = 0; idx < 10000; idx++) {
    integrator.step();
    if (idx % 50 == 0) {
      v = integrator.mesh.vertices.map((v) => v.values).flat();
      i = integrator.mesh.triangles.map((v) => v.values).flat();
      responsePayload.frames.push({ vertices: v, indices: i });
    }
  }

  ok(res, responsePayload);
}
