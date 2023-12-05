import { expect, test, describe } from "bun:test";
import Vector from "./vector";

describe("Vector", () => {
  describe("add", () => {
    test("Vector add", () => {
      const v1 = new Vector(1, 2);
      const v2 = new Vector(3, 4);
      const result = v1.add(v2);
      expect(result.values).toEqual([4, 6]);
    });

    test("Vector add fails for two vectors of different lengths", () => {
      const v1 = new Vector(1, 2);
      const v2 = new Vector(3, 4, 5);

      // Make sure that adding these throws an error
      expect(() => v1.add(v2)).toThrow();
    });
  });

  test("Vector sub", () => {
    const v1 = new Vector(1, 2);
    const v2 = new Vector(3, 4);
    const result = v1.sub(v2);
    expect(result.values).toEqual([-2, -2]);
  });

  test("Vector mul", () => {
    const v1 = new Vector(1, 2);
    const result = v1.mul(2);
    expect(result.values).toEqual([2, 4]);
  });

  test("Vector div", () => {
    const v1 = new Vector(2, 4);
    const result = v1.div(2);
    expect(result.values).toEqual([1, 2]);
  });

  test("Vector dot", () => {
    const v1 = new Vector(1, 2);
    const v2 = new Vector(3, 4);
    const result = v1.dot(v2);
    expect(result).toEqual(11);
  });

  test("Vector length", () => {
    const v1 = new Vector(3, 4);
    const result = v1.norm();
    expect(result).toEqual(5);
    v1.normalize();
    expect(v1.norm()).toEqual(1);
  });

  test("Vector normalized", () => {
    const v1 = new Vector(3, 4);
    const result = v1.normalized();
    expect(result.values).toEqual([3 / 5, 4 / 5]);
  });

  test("Vector clone", () => {
    const v1 = new Vector(1, 2);
    const v2 = v1.clone();

    expect(v1).toEqual(v2);

    v2.x = 3;
    v2.y = 4;

    expect(v1).not.toEqual(v2);
  });

  describe("set", () => {
    test("set single index", () => {
      const v1 = new Vector(1, 2);
      v1.set(0, 3);
      expect(v1.values).toEqual([3, 2]);
    });

    test("set multiple indices", () => {
      const v1 = new Vector(1, 2, 3, 4, 5);
      v1.set([0, 1, 2], [10, 11, 12]);
      v1.set([3, 4], [13, 14]);
      expect(v1.values).toEqual([10, 11, 12, 13, 14]);
    });
  });

  describe("get", () => {
    test("get single index", () => {
      const v1 = new Vector(1, 2);
      expect(v1.get(0)).toEqual(1);
    });

    test("get multiple indices", () => {
      const v1 = new Vector(1, 2, 3, 4, 5);
      expect(v1.get([0, 1, 2])).toEqual([1, 2, 3]);
    });
  });
});
