import Matrix from "../linear-algebra/matrix";
import { NonLinearMaterial } from "./material";

export default class STVK extends NonLinearMaterial {
  constructor(lambda: number, mu: number) {
    super("STVK", lambda, mu);
  }

  public psi(F: Matrix): number {
    const E = F.transpose().mul(F).sub(Matrix.identity(2)).mul(0.5);
    return this.mu * E.squaredNorm() + this.lambda * 0.5 * E.trace() ** 2;
  }

  public PK1(F: Matrix): Matrix {
    return F.mul(this.PK2(F));
  }

  public hessian(F: Matrix): Matrix {
    throw new Error("Method not implemented.");
  }

  /*
   * S = second Piola-Kirchoff stress tensor
   */
  private PK2(F: Matrix): Matrix {
    const identity = Matrix.identity(2);
    const E = F.transpose().mul(F).sub(identity).mul(0.5);
    const S = identity.mul(this.lambda * E.trace()).add(E.mul(this.mu * 2));
    return S;
  }

  /*
   * compute the derivative of S, the second Piola-Kirchhoff
   * with respect to E = 1/2 (F^T * F - I)
   */
  private DSDE(): Matrix {
    const result = Matrix.zero(4, 4);
    result.set(0, 0, this.lambda + 2 * this.mu);
    result.set(3, 0, this.lambda);
    result.set(1, 1, 2 * this.mu);
    result.set(2, 2, 2 * this.mu);
    result.set(0, 3, this.lambda);
    result.set(3, 3, this.lambda + 2 * this.mu);

    return result;
  }

  /*
   * take the gradient of FS (i.e. PK1) w.r.t F assuming that S is frozen
   */
  private DFSDF(S: Matrix): Matrix {
    const result = Matrix.zero(4, 4);
    result.set(0, 0, S.get(0, 0));
    result.set(1, 1, S.get(0, 0));
    result.set(2, 2, S.get(1, 1));
    result.set(3, 3, S.get(1, 1));
    result.set(2, 0, S.get(0, 1));
    result.set(3, 1, S.get(0, 1));
    result.set(0, 2, S.get(1, 0));
    result.set(1, 3, S.get(1, 0));
    return result;
  }
}
