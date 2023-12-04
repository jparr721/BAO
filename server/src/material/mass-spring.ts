import { Matrix } from "mathjs";
import { LinearMaterial } from "./material";
import { matrixSize } from "../utils";
import * as math from "mathjs";
import { l2Norm } from "../geometry/triangles";

/**
 * A mass-spring material.
 */
export default class MassSpring extends LinearMaterial {
  private stiffness: number;
  private restLength: number;
  private kover2: number;
  constructor(k: number, d: number) {
    super("MassSpring");

    this.stiffness = k;
    this.restLength = d;
    this.kover2 = this.stiffness / 2.0;
  }

  psi(x: Matrix): number {
    // Make sure x is length 4
    const sz = matrixSize(x);
    if (sz.rows !== 4 || sz.cols !== 1) {
      throw new Error(
        `Invalid input dimension for x, got ${sz.rows}x${sz.cols}, wanted 4x1.`
      );
    }

    // p0 is the first three rows of x
    const p0 = x.subset(math.index([0, 1], [0]));

    // p1 is the last three rows of x
    const p1 = x.subset(math.index([2, 3], [0]));

    // Compute the difference between the two points then take the norm. We take the norm because
    // we want the length of the spring as a scalar.
    const diff = l2Norm(math.subtract(p1, p0)) - this.restLength;

    // The strain energy density is just the spring constant times the difference in length.
    return this.kover2 * diff * diff;
  }

  PK1(x: Matrix): Matrix {
    // p0 is the first three rows of x
    const p0 = x.subset(math.index([0, 1], [0]));

    // p1 is the last three rows of x
    const p1 = x.subset(math.index([2, 3], [0]));

    // Compute the difference between the two points then take the norm. We take the norm because
    // we want the length of the spring as a scalar.
    const diff = l2Norm(math.subtract(p1, p0));

    // Compute the coefficient of (P_1 - P_0 / ||P_1 - P_0||) in the gradient
    const mult = math.zeros(4) as math.Matrix;

    // The first three entries are (p0 - p1)
    mult.subset(
      math.index([0, 1], [0]),
      math.multiply(math.subtract(p0, p1), this.stiffness)
    );

    // The next thee are (p1 - p0)
    mult.subset(
      math.index([2, 3], [0]),
      math.multiply(math.subtract(p1, p0), this.stiffness)
    );

    return math.divide(
      math.multiply(mult, diff - this.restLength),
      diff
    ) as Matrix;
  }

  hessian(x: Matrix): Matrix {
    throw new Error("Method not implemented.");
  }
}
