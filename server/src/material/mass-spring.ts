import { LinearMaterial } from "./material";
import Vector from "../linear-algebra/vector";

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

    // p0 is the first two rows of x
    const p0 = x.slice(0, 2);

    // p1 is the last two rows of x
    const p1 = x.slice(2, 4);

    // Compute the difference between the two points then take the norm. We take the norm because
    // we want the length of the spring as a scalar.
    const diff = p1.sub(p0).norm() - this.restLength;

    // The strain energy density is just the spring constant times the difference in length.
    return this.kover2 * diff * diff;
  }

  PK1(x: Vector): Vector {
    // p0 is the first two rows of x
    const p0 = x.slice(0, 2);

    // p1 is the last twp rows of x
    const p1 = x.slice(2, 4);

    // Compute the difference between the two points then take the norm. We take the norm because
    // we want the length of the spring as a scalar.
    const diff = p1.sub(p0).norm();

    // Compute the coefficient of (P_1 - P_0 / ||P_1 - P_0||) in the gradient
    const mult = Vector.zero(4);

    // The first two entries are (p0 - p1)
    mult.set([0, 1], p0.sub(p1).mul(this.stiffness).values);
    mult.set([2, 3], p1.sub(p0).mul(this.stiffness).values);

    return mult.mul(diff - this.restLength).div(diff) as Vector;
  }

  hessian(x: Vector): Vector {
    throw new Error("Method not implemented.");
  }
}
