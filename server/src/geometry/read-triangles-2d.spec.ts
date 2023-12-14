import { expect, test } from "bun:test";

import readTriangles2D from "./read-triangles-2d";

test("loadTriangles2D", () => {
  const bunnyMeshPrefix = "meshes/bunny/bunny.1";
  const { vertices, indices: triangles } = readTriangles2D(bunnyMeshPrefix);
  expect(vertices.length).toBe(57);
  expect(triangles.length).toBe(71);
});
