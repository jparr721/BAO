import { Request, Response } from "express";
import { join } from "path";
import fs from "fs";
import readTriangles2D from "../geometry/read-triangles-2d";
import { errorNotFound } from "./error-response";
import { ok } from "./http-response";

const MESH_PATH = join(import.meta.dir, "..", "..", "meshes");
const ALL_MESHES = fs.readdirSync(MESH_PATH);

export async function getAllMeshes(req: Request, res: Response) {
  ok(res, { meshes: ALL_MESHES });
}

export async function getMeshByName(req: Request, res: Response) {
  const name = req.params.name;

  // If the mesh exists, send back the mesh
  if (ALL_MESHES.includes(name)) {
    const payload = readTriangles2D(join(MESH_PATH, name, name + ".1"));
    ok(res, payload);
  } else {
    errorNotFound(res, `Mesh ${name} not found`, `getMeshByName`);
  }
}
