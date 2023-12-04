import * as math from "mathjs";
import { l2Norm } from "../geometry/triangles";

export abstract class LinearMaterial {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Computes the strain energy density for the (hypter)ealstic material.
   * @param F The deformation gradient
   */
  abstract psi(x: math.Matrix): number;

  /**
   * Computes the first piola-kirchoff stress tensor for the (hypter)elastic material.
   * @param F The deformation gradient
   */
  abstract PK1(x: math.Matrix): math.Matrix;

  /**
   * Computes the hessian matrix for the (hyper)elastic material.
   * @param F The deformation gradient
   */
  abstract hessian(x: math.Matrix): math.Matrix;

  finiteDifferenceTestForces(x: math.Matrix): boolean {
    const psi0 = this.psi(x);
    const pk10 = this.PK1(x);

    let eps = 1e-4;
    let e = 0;
    let minSeen = Number.MAX_VALUE;
    while (eps > 1e-8) {
      const finiteDiff = math.matrix(math.zeros([4, 1]));

      for (let i = 0; i < 4; i++) {
        const xNew = math.clone(x);

        // Perturb the input slightly
        xNew.set([i, 0], x.get([i, 0]) + eps);

        // Compute the new energy value
        const psiP = this.psi(xNew);

        // Store the finite difference
        finiteDiff.set([i, 0], (psiP - psi0) / eps);
      }

      // Compute the error
      const diff = math.subtract(pk10, finiteDiff);
      const error = l2Norm(diff);

      if (error < minSeen) {
        minSeen = error;
      }

      if (e === 4 && minSeen > 1e-6) {
        console.log("Test failed for " + this.name + " with error " + minSeen);
        console.log("PK1: " + pk10);
        console.log("psi0: " + psi0);
        console.log("Finite Difference: " + finiteDiff);
        return false;
      }

      eps *= 0.1;
      e++;
    }

    if (minSeen < 1e-6) {
      console.log("Test passed for " + this.name + " with error " + minSeen);
      return true;
    } else {
      console.log("Test failed for " + this.name + " with error " + minSeen);
      return false;
    }
  }

  static computeMu(E: number, nu: number): number {
    return E / (2.0 * (1.0 + nu));
  }

  static computeLambda(E: number, nu: number): number {
    return (E * nu) / ((1.0 + nu) * (1.0 - 2.0 * nu));
  }
}

export abstract class NonLinearMaterial {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Computes the strain energy density for the (hypter)ealstic material.
   * @param F The deformation gradient
   */
  abstract psi(F: math.Matrix): number;

  /**
   * Computes the first piola-kirchoff stress tensor for the (hypter)elastic material.
   * @param F The deformation gradient
   */
  abstract PK1(F: math.Matrix): math.Matrix;

  /**
   * Computes the hessian matrix for the (hyper)elastic material.
   * @param F The deformation gradient
   */
  abstract hessian(F: math.Matrix): math.Matrix;

  static computeMu(E: number, nu: number): number {
    return E / (2.0 * (1.0 + nu));
  }

  static computeLambda(E: number, nu: number): number {
    return (E * nu) / ((1.0 + nu) * (1.0 - 2.0 * nu));
  }
}
