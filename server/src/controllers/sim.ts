import { Request, Response } from "express";
import readTriangles2D from "../geometry/read-triangles-2d";
import { TriangleMesh } from "../geometry/triangle-mesh";
import MassSpring from "../material/mass-spring";
import ForwardEulerSpring from "../integrator/forward-euler-spring";
import { mkdirSync } from "fs";
import { join } from "path";
import { ok } from "./http-response";

export async function runSimulation(req: Request, res: Response) {
  const { vertices, triangles } = readTriangles2D(
    join(import.meta.dir, "..", "..", "/meshes/bunny/bunny.1")
  );
  const mesh = new TriangleMesh(vertices, triangles, 5 /* uniformMass */);
  const material = new MassSpring(1.0, 1);
  const integrator = new ForwardEulerSpring(mesh, material, 1.0 / 200.0);

  integrator.addGravity([0, -90.8]);

  mkdirSync("simOutput", { recursive: true });
  integrator.mesh.saveFrameToObj("simOutput/frame_0.obj");

  const responsePayload: { frames: { v: number[]; f: number[] }[] } = {
    frames: [],
  };

  let v = integrator.mesh.vertices.map((v) => v._data[0]);
  let f = integrator.mesh.triangles.map((v) => v._data[0]);

  responsePayload.frames.push({ v, f });

  for (let i = 0; i < 100; i++) {
    integrator.step();
    v = integrator.mesh.vertices.map((v) => v._data[0]);
    f = integrator.mesh.triangles.map((v) => v._data[0]);
    responsePayload.frames.push({ v, f });
    integrator.mesh.saveFrameToObj(`simOutput/frame_${i + 1}.obj`);
  }

  ok(res, responsePayload);
}
