import fs from "fs";
import { join } from "path";
import readTriangles2D from "./read-triangles-2d";

export const MESHES_FOLDER = join(import.meta.dir, "..", "..", "meshes");
export const ALL_MESHES = fs.readdirSync(MESHES_FOLDER);

export default function readMeshFromStoreByName(meshName: string) {
  const prefix = join(MESHES_FOLDER, meshName, meshName);
  return readTriangles2D(prefix);
}
