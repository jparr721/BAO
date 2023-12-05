import { LinearMaterial } from "./material";
import { matrixSize } from "../utils";
import * as math from "mathjs";
import { l2Norm } from "../geometry/triangles";
import { Vector } from "../linear-algebra/vector";

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

  psi(x: Vector): number {
    // Make sure x is length 4
    if (x.rows !== 4) {
      throw new Error("x must be length 4");
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

  PK1(x: Vector): Vector {
    // p0 is the first three rows of x
    const p0 = x.subset(math.index([0, 1], [0]));

    // p1 is the last three rows of x
    const p1 = x.subset(math.index([2, 3], [0]));

    // Compute the difference between the two points then take the norm. We take the norm because
    // we want the length of the spring as a scalar.
    const diff = l2Norm(math.subtract(p1, p0));

    // Compute the coefficient of (P_1 - P_0 / ||P_1 - P_0||) in the gradient
    const mult = Vector.zeros(4);

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
    ) as Vector;
  }

  hessian(x: Vector): Vector {
    throw new Error("Method not implemented.");
  }
}
