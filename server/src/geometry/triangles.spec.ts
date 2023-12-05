import { expect, test, describe } from "bun:test";
import { triangleArea, evaluateFPartialDerivativeColumn } from "./triangles";
import Vector from "../linear-algebra/vector";
import Matrix from "../linear-algebra/matrix";

test("triangleArea", () => {
  const t0 = Vector.fromArray([0, 0, 0]);
  const t1 = Vector.fromArray([1, 0, 0]);
  const t2 = Vector.fromArray([0, 1, 0]);
  const result = triangleArea(t0, t1, t2);
  expect(result).toBeCloseTo(0.5);
});

describe("evaluateFPartialDerivativeColumn", () => {
  const DmInv = Matrix.identity(2);
  test("0", () => {
    const result = evaluateFPartialDerivativeColumn(0, DmInv);
    const zero = Matrix.zero(2, 2);
    zero.set(0, 0, -1);
    zero.set(0, 1, -1);
    expect(result).toEqual(zero);
  });

  test("1", () => {
    const result = evaluateFPartialDerivativeColumn(1, DmInv);
    const zero = Matrix.zero(2, 2);
    zero.set(1, 0, -1);
    zero.set(1, 1, -1);
    expect(result).toEqual(zero);
  });

  test("2", () => {
    const result = evaluateFPartialDerivativeColumn(2, DmInv);
    const zero = Matrix.zero(2, 2);
    zero.set(0, 0, 1);
    expect(result).toEqual(zero);
  });

  test("3", () => {
    const result = evaluateFPartialDerivativeColumn(3, DmInv);
    const zero = Matrix.zero(2, 2);
    zero.set(1, 0, 1);
    expect(result).toEqual(zero);
  });

  test("4", () => {
    const result = evaluateFPartialDerivativeColumn(4, DmInv);
    const zero = Matrix.zero(2, 2);
    zero.set(0, 1, 1);
    expect(result).toEqual(zero);
  });

  test("5", () => {
    const result = evaluateFPartialDerivativeColumn(5, DmInv);
    const zero = Matrix.zero(2, 2);
    zero.set(1, 1, 1);
    expect(result).toEqual(zero);
  });
});
