import { Request, Response } from "express";
import readTriangles2D from "../geometry/read-triangles-2d";
import SpringMesh from "../geometry/spring-mesh";
import MassSpring from "../material/mass-spring";
import ForwardEulerSpring from "../integrator/forward-euler-spring";
import { join } from "path";
import { ok } from "./http-response";
import Vector from "../linear-algebra/vector";
import TriangleMesh from "../geometry/triangle-mesh";
import STVK from "../material/stvk";
import ForwardEulerArea from "../integrator/forward-euler-area";
import SNH from "../material/snh";

export async function runSimulation(req: Request, res: Response) {
  const { vertices, triangles } = readTriangles2D(
    join(import.meta.dir, "..", "..", "/meshes/bunny/bunny.1")
  );

  // const vertices = [
  //   Vector.fromArray([0, 0]),
  //   Vector.fromArray([1, 0]),
  //   Vector.fromArray([0, 1]),
  // ];
  // const triangles = [Vector.fromArray([0, 1, 2])];

  // const mesh = new SpringMesh(vertices, triangles, 1 /* uniformMass */);

  // // Pin the top 5% of vertices
  // const pinned = mesh.vertices.map((v) => v.y > 0);
  // mesh.pinnedVertices = pinned;

  // const material = new MassSpring(100.0, 0.5);
  // const integrator = new ForwardEulerSpring(mesh, material, 1.0 / 15000.0);

  // integrator.addGravity(Vector.fromArray([0, -9.8]));

  const mesh = new TriangleMesh(vertices, triangles, 5 /* uniformMass */);
  const pinned = mesh.vertices.map((v) => v.y > 0.4);
  // const pinned = mesh.vertices.map((v) => v.y > 0);
  mesh.pinnedVertices = pinned;

  const poissionsRatio = 0.45;
  const youngsModulus = 5.0;
  const lambda = STVK.computeLambda(youngsModulus, poissionsRatio);
  const mu = STVK.computeMu(youngsModulus, poissionsRatio);

  const material = new STVK(lambda, mu);
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
