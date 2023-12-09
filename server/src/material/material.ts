import Matrix from "../linear-algebra/matrix";
import Vector from "../linear-algebra/vector";

export abstract class LinearMaterial {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Computes the strain energy density for the (hypter)ealstic material.
   * @param F The deformation gradient
   */
  abstract psi(x: Vector): number;

  /**
   * Computes the first piola-kirchoff stress tensor for the (hypter)elastic material.
   * @param F The deformation gradient
   */
  abstract PK1(x: Vector): Vector;

  /**
   * Computes the hessian matrix for the (hyper)elastic material.
   * @param F The deformation gradient
   */
  abstract hessian(x: Vector): Vector;

  public finiteDifferenceTestForces(x: Vector): boolean {
    const psi0 = this.psi(x);
    const pk10 = this.PK1(x);

    let eps = 1e-4;
    let e = 0;
    let minSeen = Number.MAX_VALUE;
    while (eps > 1e-8) {
      const finiteDiff = Vector.zero(4);

      for (let i = 0; i < 4; i++) {
        const xNew = x.clone();

        // Perturb the input slightly
        xNew.set(i, x.get(i) + eps);

        // Compute the new energy value
        const psiP = this.psi(xNew);

        // Store the finite difference
        finiteDiff.set(i, (psiP - psi0) / eps);
      }

      // Compute the error
      const diff = pk10.sub(finiteDiff);
      const error = diff.norm();

      if (error < minSeen) {
        minSeen = error;
      }

      if (e === 4 && minSeen > 1e-6) {
        console.log("Test failed for ", this.name, " with error ", minSeen);
        console.log("PK1: ", pk10.values);
        console.log("psi0: ", psi0);
        console.log("Finite Difference: ", finiteDiff.values);
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
  abstract psi(F: Matrix): number;

  /**
   * Computes the first piola-kirchoff stress tensor for the (hypter)elastic material.
   * @param F The deformation gradient
   */
  abstract PK1(F: Matrix): Matrix;

  /**
   * Computes the hessian matrix for the (hyper)elastic material.
   * @param F The deformation gradient
   */
  abstract hessian(F: Matrix): Matrix;

  public finiteDifferenceTestPK1(F: Matrix): boolean {
    const psi0 = this.psi(F);
    const PK10 = this.PK1(F);

    let eps = 1e-4;
    let e = 0;
    let minSeen = Number.MAX_VALUE;
    while (eps > 1e-8) {
      let finiteDiffPK1 = Matrix.zero(2, 2);

      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          const FNew = F.clone();

          // Perturb the input slightly
          FNew.set(i, j, F.get(i, j) + eps);

          // Compute the new energy value
          const psiP = this.psi(FNew);

          // Store the finite difference
          finiteDiffPK1.set(i, j, (psiP - psi0) / eps);
        }
      }

      const diff = PK10.sub(finiteDiffPK1);
      const error = diff.norm();
      if (error < minSeen) {
        minSeen = error;
      }

      if (e == 4 && minSeen > 1e-6) {
        console.log("Test failed for ", this.name, " with error ", minSeen);
        console.log("PK1: ", PK10.values);
        console.log("psi0: ", psi0);
        console.log("Finite Difference: ", finiteDiffPK1.values);
        return false;
      }

      eps *= 0.1;
      e++;
    }

    if (minSeen < 1e-6) {
      return true;
    } else {
      return false;
    }
  }
}

export function computeMu(E: number, nu: number): number {
  return E / (2.0 * (1.0 + nu));
}

export function computeLambda(E: number, nu: number): number {
  return (E * nu) / ((1.0 + nu) * (1.0 - 2.0 * nu));
}
