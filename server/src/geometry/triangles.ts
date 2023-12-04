import * as math from "mathjs";
import { getMatrixRow, matrixSize } from "../utils";

export function vec2To3(v: math.Matrix): math.Matrix {
  if (matrixSize(v).rows !== 2) {
    throw new Error("v is not a vector2");
  }

  // Extract the components
  const v0 = getMatrixRow(v, 0)[0];
  const v1 = getMatrixRow(v, 1)[0];

  return math.matrix([v0, v1, 0.0]);
}

export function flatten(m: math.Matrix): math.Matrix {
  const sz = matrixSize(m);
  if (sz.cols === 1) {
    throw new Error("m is already flat");
  }

  if (sz.rows !== 2 || sz.cols != 2) {
    throw new Error("m is not a matrix2");
  }

  const result = math.matrix([0, 0, 0, 0]);
  result.set([0], m.get([0, 0]));
  result.set([1], m.get([1, 0]));
  result.set([2], m.get([0, 1]));
  result.set([3], m.get([1, 1]));
  return result;
}

export function unFlatten(m: math.Matrix): math.Matrix {
  const sz = matrixSize(m);
  if (sz.cols !== 1) {
    throw new Error("m is not flat");
  }

  if (sz.rows !== 4) {
    throw new Error("m is not a vector4");
  }

  const result = math.matrix(math.zeros([2, 2]));
  result.set([0, 0], m.get([0]));
  result.set([1, 0], m.get([1]));
  result.set([0, 1], m.get([2]));
  result.set([1, 1], m.get([3]));
  return result;
}

/**
 * This function smoothes over an issue in the mathjs api where a matrix type that represents a vector is
 * unable to use the math.norm function. This function will take a vector and return the norm of that vector if the
 * input _is_ a vector, otherwise it calls the mathjs library to take the norm of the matrix.
 * @param m The input matrix
 * @returns The L2 norm
 */
export function l2Norm(m: math.Matrix): number {
  try {
    return math.norm(m) as number;
  } catch {
    const sz = matrixSize(m);
    if (sz.cols === 1) {
      // Compute vector l2 norm
      let sum = 0.0;

      for (let i = 0; i < sz.rows; i++) {
        const value = m.get([i, 0]);

        sum += value * value;
      }
      return Math.sqrt(sum);
    }
  }
}

export function triangleArea(
  t0: math.Matrix,
  t1: math.Matrix,
  t2: math.Matrix
): number {
  // Make sure they're all vector3
  if (matrixSize(t0).rows !== 3) {
    throw new Error("t0 is not a vector3");
  }

  if (matrixSize(t1).rows !== 3) {
    throw new Error("t1 is not a vector3");
  }

  if (matrixSize(t2).rows !== 3) {
    throw new Error("t2 is not a vector3");
  }

  const a = math.subtract(t1, t0);
  const b = math.subtract(t2, t0);
  const c = math.cross(a, b);

  // Downcast to number and let the archangels take us
  return 0.5 * (math.norm(c) as number);
}

export function evaluateFPartialDerivativeColumn(
  index: number,
  DmInv: math.Matrix
): math.Matrix {
  const result = math.matrix(math.zeros([2, 2]));

  if (index == 0) {
    result.set([0, 0], -1);
    result.set([0, 1], -1);
    // result << -1, -1,
    //            0, 0;
  }
  if (index == 1) {
    result.set([1, 0], -1);
    result.set([1, 1], -1);
    // result <<  0,  0,
    //           -1, -1;
  }
  if (index == 2) {
    result.set([0, 0], 1);
    // result <<  1, 0,
    //            0, 0;
  }
  if (index == 3) {
    result.set([1, 0], 1);
    // result <<  0, 0,
    //            1, 0;
  }
  if (index == 4) {
    result.set([0, 1], 1);
    // result <<  0, 1,
    //            0, 0;
  }
  if (index == 5) {
    result.set([1, 1], 1);
    // result <<  0, 0,
    //            0, 1;
  }

  return math.multiply(result, DmInv);
}

export function evaluateFPartialDerivative(DmInv: math.Matrix): math.Matrix {
  const result = math.matrix(math.zeros([4, 6]));

  for (let i = 0; i < 6; i++) {
    // Set the column to the flattened derivative
    const derivative = flatten(evaluateFPartialDerivativeColumn(i, DmInv));

    // Now, set the column of the result
    for (let j = 0; j < 4; j++) {
      result.set([j, i], derivative.get([j]));
    }
  }

  return result;
}

export function constructDiagonalSparseMatrix(
  values: math.Matrix
): math.Matrix {
  const sz = matrixSize(values);
  const result = math.zeros([sz.rows, sz.rows], "sparse") as any;
  for (let i = 0; i < matrixSize(values).rows; i++) {
    result.set([i, i], values.get([i, 0]));
  }
  return result;
}

