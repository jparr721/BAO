import { expect, describe, test } from "bun:test";
import Matrix from "./matrix";
import e from "express";
import Vector from "./vector";

describe("matrix", () => {
  describe("constructor", () => {
    test("constructor - valid", () => {
      const matrix = new Matrix(2, 2, [1, 2, 3, 4]);
      expect(matrix.get(0, 0)).toEqual(1);
      expect(matrix.get(0, 1)).toEqual(2);
      expect(matrix.get(1, 0)).toEqual(3);
      expect(matrix.get(1, 1)).toEqual(4);
    });
  });

  describe("static initializers", () => {
    test("zero", () => {
      const matrix = Matrix.zero(2, 2);
      expect(matrix.shape).toEqual([2, 2]);
      expect(matrix.get(0, 0)).toEqual(0);
      expect(matrix.get(0, 1)).toEqual(0);
      expect(matrix.get(1, 0)).toEqual(0);
      expect(matrix.get(1, 1)).toEqual(0);
    });

    test("one", () => {
      const matrix = Matrix.one(2, 2);
      expect(matrix.shape).toEqual([2, 2]);
      expect(matrix.get(0, 0)).toEqual(1);
      expect(matrix.get(0, 1)).toEqual(1);
      expect(matrix.get(1, 0)).toEqual(1);
      expect(matrix.get(1, 1)).toEqual(1);
    });

    test("identity", () => {
      const matrix = Matrix.identity(2);
      expect(matrix.shape).toEqual([2, 2]);
      expect(matrix.get(0, 0)).toEqual(1);
      expect(matrix.get(0, 1)).toEqual(0);
      expect(matrix.get(1, 0)).toEqual(0);
      expect(matrix.get(1, 1)).toEqual(1);
    });
  });

  describe("accessors", () => {
    test("row", () => {
      const matrix = new Matrix(2, 2, [1, 2, 3, 4]);
      const row0 = matrix.row(0);
      expect(row0.values).toStrictEqual([1, 2]);
      const row1 = matrix.row(1);
      expect(row1.values).toStrictEqual([3, 4]);
    });

    test("col", () => {
      const matrix = new Matrix(2, 2, [1, 2, 3, 4]);
      const col0 = matrix.col(0);
      expect(col0.values).toStrictEqual([1, 3]);
      const col1 = matrix.col(1);
      expect(col1.values).toStrictEqual([2, 4]);
    });
  });

  describe("operations", () => {
    test("add", () => {
      const matrix = Matrix.one(2, 2);
      const other = Matrix.one(2, 2);
      expect(matrix.add(other).values).toStrictEqual([2, 2, 2, 2]);
    });
    test("addInPlace", () => {
      const matrix = Matrix.one(2, 2);
      const other = Matrix.one(2, 2);
      matrix.addInPlace(other);
      expect(matrix.values).toStrictEqual([2, 2, 2, 2]);
    });

    test("sub", () => {
      const matrix = Matrix.one(2, 2);
      const other = Matrix.one(2, 2);
      expect(matrix.sub(other).values).toStrictEqual([0, 0, 0, 0]);
    });
    test("subInPlace", () => {
      const matrix = Matrix.one(2, 2);
      const other = Matrix.one(2, 2);
      matrix.subInPlace(other);
      expect(matrix.values).toStrictEqual([0, 0, 0, 0]);
    });

    test("mul scalar", () => {
      const matrix = Matrix.one(2, 2);
      const res = matrix.mul(2);
      expect(res.values).toStrictEqual([2, 2, 2, 2]);
    });

    test("mul vector", () => {
      const matrix = Matrix.one(2, 2);
      const vector = Vector.fromArray([1, 2]);
      expect(matrix.mul(vector).values).toStrictEqual([3, 3]);
    });

    test("mul vector - uneven matrix", () => {
      const matrix = new Matrix(2, 3, [1, -1, 2, 0, -3, 1]);
      const vector = Vector.fromArray([2, 1, 0]);
      expect(matrix.mul(vector).values).toStrictEqual([1, -3]);
    });

    test("mul matrix", () => {
      const matrix = Matrix.one(2, 2).mul(4);
      const other = Matrix.one(2, 2).mul(5);
      other.set(0, 0, 2);
      other.set(0, 1, 20);
      expect(matrix.mul(other).values).toStrictEqual([28, 100, 28, 100]);
    });

    test("inv", () => {
      const matrix = new Matrix(3, 3, [7, 8, 3, 4, 5, 6, 7, 8, 9]);
      const inv = matrix.inv();

      const invCompare = new Matrix(
        3,
        3,
        [
          -0.16666667, -2.66666667, 1.83333333, 0.33333333, 2.33333333,
          -1.66666667, -0.16666667, 0, 0.16666667,
        ]
      );

      inv.values.forEach((v, i) => {
        expect(v).toBeCloseTo(invCompare.values[i]);
      });

      expect(
        matrix
          .mul(inv)
          .values.map(Math.round)
          .map((val) => (Object.is(val, -0) ? 0 : val))
      ).toStrictEqual(Matrix.identity(3).values);
    });
  });
});
