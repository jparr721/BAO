import { Request, Response } from "express";
import readTriangles2D from "../geometry/read-triangles-2d";
import { TriangleMesh } from "../geometry/triangle-mesh";
import MassSpring from "../material/mass-spring";
import ForwardEulerSpring from "../integrator/forward-euler-spring";
import { mkdirSync } from "fs";
import { join } from "path";
import { ok } from "./http-response";
import Vector from "../linear-algebra/vector";

export async function runSimulation(req: Request, res: Response) {
  const { vertices, triangles } = readTriangles2D(
    join(import.meta.dir, "..", "..", "/meshes/bunny/bunny.1")
  );
  const mesh = new TriangleMesh(vertices, triangles, 5 /* uniformMass */);

  // Pin the top 5% of vertices
  const pinned = mesh.vertices.map((v) => v.y > 0);
  mesh.pinnedVertices = pinned;

  const material = new MassSpring(100.0, 0.5);
  const integrator = new ForwardEulerSpring(mesh, material, 1.0 / 15000.0);

  integrator.addGravity(Vector.fromArray([0, -9.8]));

  mkdirSync("simOutput", { recursive: true });
  integrator.mesh.saveFrameToObj("simOutput/frame_0.obj");

  const responsePayload: {
    frames: { vertices: number[]; indices: number[] }[];
  } = {
    frames: [],
  };

  let v = integrator.mesh.vertices.map((v) => v.values).flat();
  let i = integrator.mesh.triangles.map((v) => v.values).flat();

  responsePayload.frames.push({ vertices: v, indices: i });

  for (let idx = 0; idx < 100; idx++) {
    integrator.step();
    if (idx % 1000 == 0) {
      v = integrator.mesh.vertices.map((v) => v.values).flat();
      i = integrator.mesh.triangles.map((v) => v.values).flat();
      responsePayload.frames.push({ vertices: v, indices: i });
    }
    // integrator.mesh.saveFrameToObj(`simOutput/frame_${idx + 1}.obj`);
  }

  ok(res, responsePayload);
}
