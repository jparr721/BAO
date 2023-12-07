import Matrix from "../linear-algebra/matrix";
import Vector from "../linear-algebra/vector";

export function triangleArea(t0: Vector, t1: Vector, t2: Vector): number {
  const a = t1.sub(t0);
  const b = t2.sub(t0);

  if (a.length == 2) {
    const a3 = Vector.fromArray([...a.values, 0]);
    const b3 = Vector.fromArray([...b.values, 0]);
    return 0.5 * a3.cross(b3).norm();
  }

  const c = a.cross(b).norm();
  return 0.5 * c;
}

export function evaluateFPartialDerivativeColumn(
  index: number,
  DmInv: Matrix
): Matrix {
  const result = Matrix.zero(2, 2);

  if (index == 0) {
    result.set(0, 0, -1);
    result.set(0, 1, -1);
    // result << -1, -1,
    //            0, 0;
  }
  if (index == 1) {
    result.set(1, 0, -1);
    result.set(1, 1, -1);
    // result <<  0,  0,
    //           -1, -1;
  }
  if (index == 2) {
    result.set(0, 0, 1);
    // result <<  1, 0,
    //            0, 0;
  }
  if (index == 3) {
    result.set(1, 0, 1);
    // result <<  0, 0,
    //            1, 0;
  }
  if (index == 4) {
    result.set(0, 1, 1);
    // result <<  0, 1,
    //            0, 0;
  }
  if (index == 5) {
    result.set(1, 1, 1);
    // result <<  0, 0,
    //            0, 1;
  }

  return result.mul(DmInv);
}

export function evaluateFPartialDerivative(DmInv: Matrix): Matrix {
  const result = Matrix.zero(4, 6);

  for (let i = 0; i < 6; i++) {
    // Set the column to the flattened derivative
    const derivative = evaluateFPartialDerivativeColumn(
      i,
      DmInv
    ).colwiseFlatten();

    result.setCol(i, derivative);
  }

  return result;
}

export function constructDiagonalSparseMatrix(values: Vector): Matrix {
  const result = Matrix.identity(values.length);
  for (let i = 0; i < values.length; i++) {
    result.set(i, i, values.get(i));
  }
  return result;
}
