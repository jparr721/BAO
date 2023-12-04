import { expect, test } from "bun:test";
import * as math from "mathjs";
import {
  matrixSize,
  getMatrixRow,
  setMatrixColumn,
  setMatrixRow,
} from "./utils";

test("matrixSize for matrix", () => {
  const matrix = math.matrix([
    [1, 2],
    [3, 4],
  ]);
  const result = matrixSize(matrix);
  expect(result).toEqual({ rows: 2, cols: 2 });
});

test("matrixSize for vector", () => {
  const matrix = math.matrix([1, 2, 3, 4]);
  const result = matrixSize(matrix);
  expect(result).toEqual({ rows: 4, cols: 1 });
});

test("getMatrixRow", () => {
  const matrix = math.matrix([
    [1, 2],
    [3, 4],
  ]);
  let result = getMatrixRow(matrix, 1);
  expect(result).toEqual([3, 4]);

  result = getMatrixRow(matrix, 0);
  expect(result).toEqual([1, 2]);
});

test("setMatrixRow", () => {
  const matrix = math.matrix([
    [1, 2],
    [3, 4],
  ]);
  const value = math.matrix([5, 6]);
  setMatrixRow(matrix, value, 1);
  expect(matrix).toEqual(
    math.matrix([
      [1, 2],
      [5, 6],
    ])
  );
});

test("setMatrixColumn", () => {
  const matrix = math.matrix([
    [1, 2],
    [3, 4],
  ]);
  const value = math.matrix([5, 6]);
  setMatrixColumn(matrix, value, 1);
  expect(matrix).toEqual(
    math.matrix([
      [1, 5],
      [3, 6],
    ])
  );
});
