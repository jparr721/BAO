import { size, index, Matrix, range } from "mathjs";

export function matrixSize(matrix: Matrix): {
  rows: number;
  cols: number | undefined;
} {
  const sz = matrix.size();

  if (sz.length == 1) {
    return { rows: sz[0], cols: 1 };
  }

  return { rows: sz[0], cols: sz[1] };
}

export function getMatrixRow(matrix: Matrix, i: number): number[] {
  const { rows, cols } = matrixSize(matrix);
  if (cols === 1) {
    return [matrix.get([i])];
  } else {
    return matrix.subset(index(i, range(0, cols)))._data[0];
  }
}

export function setMatrixRow(matrix: Matrix, value: Matrix, i: number) {
  const { rows, cols } = matrixSize(matrix);
  if (cols === 1) {
    matrix.set([i], value.get([0]));
  } else {
    matrix.subset(index(i, range(0, cols)), value);
  }
}

export function setMatrixColumn(matrix: Matrix, value: Matrix, i: number) {
  const { rows, cols } = matrixSize(matrix);
  if (rows === 1) {
    matrix.set([i], value.get([0]));
  } else {
    matrix.subset(index(range(0, rows), i), value);
  }
}
