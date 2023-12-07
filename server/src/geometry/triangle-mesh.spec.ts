import { describe, expect, test } from "bun:test";
import TriangleMesh from "./triangle-mesh";
import Vector from "../linear-algebra/vector";
import Matrix from "../linear-algebra/matrix";

describe("triangleMesh", () => {
  const restVertices = [
    Vector.fromArray([-0.5, -0.5]),
    Vector.fromArray([0.5, -0.5]),
    Vector.fromArray([0.0, 0.5]),
  ];
  const triangles = [Vector.fromArray([0, 1, 2])];
  const mass = 1;
  describe("constructor", () => {
    test("should create a triangle mesh", () => {
      const mesh = new TriangleMesh(restVertices, triangles, mass);
      expect(mesh.vertices.length).toBe(3);
      expect(mesh.triangles.length).toBe(1);

      expect(mesh.M.values).toEqual(Matrix.identity(6).values);
      expect(mesh.Minv.values).toEqual(Matrix.identity(6).values);

      expect(mesh.restVertices).toEqual(restVertices);
      expect(mesh.vertices).toEqual(restVertices);
      expect(mesh.triangles).toEqual(triangles);
      expect((mesh as any).restAreas).toEqual([0.5]);
      expect((mesh as any).oneRingAreas[0]).toBeCloseTo(0.166666666667);
      expect((mesh as any).oneRingAreas[1]).toBeCloseTo(0.166666666667);
      expect((mesh as any).oneRingAreas[2]).toBeCloseTo(0.166666666667);
    });
  });

  describe("getters", () => {
    test("positions", () => {
      const mesh = new TriangleMesh(restVertices, triangles, mass);
      const positions = mesh.positions();
      expect(positions.values).toEqual([-0.5, -0.5, 0.5, -0.5, 0.0, 0.5]);
    });
  });

  describe("setters", () => {
    test("setPositions", () => {
      const mesh = new TriangleMesh(restVertices, triangles, mass);
      const newPositions = Vector.fromArray([0.0, 0.0, 1.0, 0.0, 0.5, 1.0]);
      expect(mesh.positions().values).toEqual([
        -0.5, -0.5, 0.5, -0.5, 0.0, 0.5,
      ]);
    });
  });
});
