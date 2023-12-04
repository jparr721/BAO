import { expect, test, describe } from "bun:test";

import * as math from "mathjs";
import {
  vec2To3,
  flatten,
  triangleArea,
  evaluateFPartialDerivativeColumn,
  unFlatten,
} from "./triangles";

test("vec2To3", () => {
  const vec2 = math.matrix([1, 2]);
  const result = vec2To3(vec2);
  expect(result).toEqual(math.matrix([1, 2, 0.0]));
});

test("flatten", () => {
  const mat2 = math.matrix([
    [1, 2],
    [3, 4],
  ]);
  const result = flatten(mat2);
  expect(result).toEqual(math.matrix([1, 3, 2, 4]));
});

test("unFlatten", () => {
  const mat4 = math.matrix([1, 3, 2, 4]);
  const result = unFlatten(mat4);
  expect(result).toEqual(
    math.matrix([
      [1, 2],
      [3, 4],
    ])
  );
});

test("triangleArea", () => {
  const t0 = math.matrix([0, 0, 0]);
  const t1 = math.matrix([1, 0, 0]);
  const t2 = math.matrix([0, 1, 0]);
  const result = triangleArea(t0, t1, t2);
  expect(result).toBeCloseTo(0.5);
});

describe("evaluateFPartialDerivativeColumn", () => {
  const DmInv = math.identity(2);
  test("0", () => {
    const result = evaluateFPartialDerivativeColumn(0, DmInv as math.Matrix);
    const zero = math.matrix(math.zeros([2, 2]));
    zero.set([0, 0], -1);
    zero.set([0, 1], -1);
    expect(result).toEqual(zero);
  });

  test("1", () => {
    const result = evaluateFPartialDerivativeColumn(1, DmInv as math.Matrix);
    const zero = math.matrix(math.zeros([2, 2]));
    zero.set([1, 0], -1);
    zero.set([1, 1], -1);
    expect(result).toEqual(zero);
  });

  test("2", () => {
    const result = evaluateFPartialDerivativeColumn(2, DmInv as math.Matrix);
    const zero = math.matrix(math.zeros([2, 2]));
    zero.set([0, 0], 1);
    expect(result).toEqual(zero);
  });

  test("3", () => {
    const result = evaluateFPartialDerivativeColumn(3, DmInv as math.Matrix);
    const zero = math.matrix(math.zeros([2, 2]));
    zero.set([1, 0], 1);
    expect(result).toEqual(zero);
  });

  test("4", () => {
    const result = evaluateFPartialDerivativeColumn(4, DmInv as math.Matrix);
    const zero = math.matrix(math.zeros([2, 2]));
    zero.set([0, 1], 1);
    expect(result).toEqual(zero);
  });

  test("5", () => {
    const result = evaluateFPartialDerivativeColumn(5, DmInv as math.Matrix);
    const zero = math.matrix(math.zeros([2, 2]));
    zero.set([1, 1], 1);
    expect(result).toEqual(zero);
  });
});
