import Vector from "./vector";
import isEqual from "lodash/isEqual";

function checkMatrixDims(target: any, propertyName: string, descriptor: any) {
  const originalMethod = descriptor.value;
  descriptor.value = function (other: Vector | Matrix) {
    if (other instanceof Vector) {
      if (this.cols !== other.values.length) {
        throw new Error(
          `Matrix and vector dimensions do not match: ${this.shape} and ${other.values.length}`
        );
      }
    } else if (other instanceof Matrix) {
      if (this.cols !== other.rows) {
        throw new Error(
          `Matrix dimensions do not match: ${this.shape} and ${other.shape}`
        );
      }
    }
    return originalMethod.apply(this, [other]);
  };
}

export default class Matrix {
  private _values: number[];
  public rows: number;
  public cols: number;

  constructor(rows: number, cols: number, values: number[]) {
    if (values.length !== rows * cols) {
      throw new Error(
        `Invalid matrix entries. Wanted ${rows * cols}, got ${values.length}`
      );
    }

    this._values = values;
    this.rows = rows;
    this.cols = cols;
  }

  public static zero(rows: number, cols: number): Matrix {
    return new Matrix(rows, cols, Array(rows * cols).fill(0));
  }

  public static one(rows: number, cols: number): Matrix {
    return new Matrix(rows, cols, Array(rows * cols).fill(1));
  }

  public static random(rows: number, cols: number): Matrix {
    return new Matrix(
      rows,
      cols,
      Array(rows * cols)
        .fill(0)
        .map(() => Math.random())
    );
  }

  public static identity(size: number): Matrix {
    return new Matrix(
      size,
      size,
      Array(size * size)
        .fill(0)
        .map((_, i) => (i % (size + 1) === 0 ? 1 : 0))
    );
  }

  get shape(): [number, number] {
    return [this.rows, this.cols];
  }

  get values(): number[] {
    return this._values;
  }

  public get(x: number, y: number): number {
    return this._values[x * this.cols + y];
  }

  public row(x: number): Vector {
    return new Vector(
      ...this._values.slice(x * this.cols, x * this.cols + this.cols)
    );
  }

  public col(y: number): Vector {
    const values = Array(this.rows)
      .fill(0)
      .map((_, x) => this._values[x * this.cols + y]);
    return new Vector(...values);
  }

  public set(x: number, y: number, value: number): void {
    this._values[x * this.cols + y] = value;
  }

  public setRow(x: number, vector: Vector): void {
    for (let i = 0; i < this.cols; i++) {
      this.set(x, i, vector.values[i]);
    }
  }

  public setCol(y: number, vector: Vector): void {
    for (let i = 0; i < this.rows; i++) {
      this.set(i, y, vector.values[i]);
    }
  }

  public add(other: Matrix): Matrix {
    if (!isEqual(this.shape, other.shape)) {
      throw new Error(
        `Matrix dimensions do not match ${this.shape} !== ${other.shape}`
      );
    }

    const values = this._values.map((value, i) => value + other.values[i]);
    return new Matrix(this.rows, this.cols, values);
  }

  public addInPlace(other: Matrix): void {
    if (!isEqual(this.shape, other.shape)) {
      throw new Error(
        `Matrix dimensions do not match ${this.shape} !== ${other.shape}`
      );
    }
    this._values = this._values.map((value, i) => value + other.values[i]);
  }

  public sub(other: Matrix): Matrix {
    if (!isEqual(this.shape, other.shape)) {
      throw new Error(
        `Matrix dimensions do not match ${this.shape} !== ${other.shape}`
      );
    }

    const values = this._values.map((value, i) => value - other.values[i]);
    return new Matrix(this.rows, this.cols, values);
  }

  public subInPlace(other: Matrix): void {
    if (!isEqual(this.shape, other.shape)) {
      throw new Error(
        `Matrix dimensions do not match ${this.shape} !== ${other.shape}`
      );
    }
    this._values = this._values.map((value, i) => value - other.values[i]);
  }

  public mul(other: number): Matrix;
  public mul(other: Vector): Vector;
  public mul(other: Matrix): Matrix;
  @checkMatrixDims
  public mul(other: number | Vector | Matrix): Matrix | Vector {
    if (other instanceof Vector) {
      const result = Vector.zero(this.rows);
      for (let row = 0; row < this.rows; row++) {
        const thisRow = this.row(row);
        const value = thisRow.dot(other as Vector);
        result.set(row, value);
      }

      return result;
    } else if (other instanceof Matrix) {
      const result = Matrix.zero(this.rows, other.cols);
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < other.cols; col++) {
          const thisRow = this.row(row);
          const otherCol = other.col(col);

          const value = thisRow.dot(otherCol);
          result.set(row, col, value);
        }
      }

      return result;
    } else if (typeof other === "number") {
      const values = this._values.map((value) => value * other);
      return new Matrix(this.rows, this.cols, values);
    } else {
      throw new Error(`Invalid type ${typeof other}`);
    }
  }

  public inv(): Matrix {
    if (this.rows !== this.cols) {
      throw new Error(`Cannot invert non-square matrix ${this.shape}`);
    }

    let matrix = this.clone();
    let inverse = Matrix.identity(this.rows);

    for (let i = 0; i < this.rows; i++) {
      let diagonalValue = matrix.get(i, i);
      if (diagonalValue === 0) {
        throw new Error("Matrix is singular and cannot be inverted.");
      }

      for (let j = 0; j < this.rows; j++) {
        matrix.set(i, j, matrix.get(i, j) / diagonalValue);
        inverse.set(i, j, inverse.get(i, j) / diagonalValue);
      }

      for (let j = 0; j < this.rows; j++) {
        if (i !== j) {
          let rowValue = matrix.get(j, i);
          for (let k = 0; k < this.rows; k++) {
            matrix.set(j, k, matrix.get(j, k) - rowValue * matrix.get(i, k));
            inverse.set(j, k, inverse.get(j, k) - rowValue * inverse.get(i, k));
          }
        }
      }
    }

    return inverse;
  }

  public norm(): number {
    return Math.sqrt(this.squaredNorm());
  }

  public squaredNorm(): number {
    return this._values.reduce((acc, value) => acc + value ** 2, 0);
  }

  public trace(): number {
    if (this.rows !== this.cols) {
      throw new Error(`Cannot take trace of non-square matrix ${this.shape}`);
    }

    return this._values.reduce((acc, value, i) => {
      if (i % (this.rows + 1) === 0) {
        return acc + value;
      } else {
        return acc;
      }
    }, 0);
  }

  public transpose(): Matrix {
    const values = new Array(this.rows * this.cols).fill(0);
    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows; row++) {
        values[col * this.rows + row] = this.get(row, col);
      }
    }

    return new Matrix(this.cols, this.rows, values);
  }

  public transposeInPlace(): void {
    const values = new Array(this.rows * this.cols).fill(0);
    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows; row++) {
        values[col * this.rows + row] = this.get(row, col);
      }
    }

    this._values = values;
    const temp = this.rows;
    this.rows = this.cols;
    this.cols = temp;
  }

  public colwiseFlatten(): Vector {
    const values = new Array(this.rows * this.cols).fill(0);
    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows; row++) {
        values[col * this.rows + row] = this.get(row, col);
      }
    }

    return new Vector(...values);
  }

  public determinant(): number {
    if (this.rows !== this.cols) {
      throw new Error(
        `Cannot take determinant of non-square matrix ${this.shape}`
      );
    }

    if (this.rows === 2) {
      return this.get(0, 0) * this.get(1, 1) - this.get(0, 1) * this.get(1, 0);
    }

    throw new Error("Dimension not supported");

    // return determinant;
  }

  public clone(): Matrix {
    return new Matrix(this.rows, this.cols, Array.from(this._values));
  }

  public toString(): string {
    let result = "";
    for (let row = 0; row < this.rows; row++) {
      result += this.row(row).toString() + "\n";
    }

    return result;
  }
}
