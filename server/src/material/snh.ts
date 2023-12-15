import Matrix from "../linear-algebra/matrix";
import { NonLinearMaterial } from "./material";

export default class SNH extends NonLinearMaterial {
  constructor(lambda: number, mu: number) {
    super("SNH", lambda + mu, mu);
  }

  public psi(F: Matrix): number {
    // Equation [13] in [Smith et al. 2018]
    const Ic = F.squaredNorm();

    // This term is from equation 14, we combine them here and ignore the
    // regularizing term from the equation since it doesn't really matter.
    const alpha = 1.0 + this.mu / this.lambda;
    const Jminus1 = F.determinant() - alpha;
    return 0.5 * (this.mu * (Ic - 3.0) + this.lambda * Jminus1 * Jminus1);
  }

  public PK1(F: Matrix): Matrix {
    const J = F.determinant();
    const PJPF = this.PJPF2D(F);
    return F.mul(this.mu)
      .sub(PJPF.mul(this.mu))
      .add(PJPF.mul((J - 1) * this.lambda));
  }

  public hessian(F: Matrix): Matrix {
    throw new Error("Method not implemented.");
  }

  private PJPF2D(F: Matrix): Matrix {
    const f0 = F.get(0, 0);
    const f1 = F.get(1, 0);
    const f2 = F.get(0, 1);
    const f3 = F.get(1, 1);
    const PJPF = Matrix.zero(2, 2);
    PJPF.set(0, 0, f3);
    PJPF.set(1, 0, -f2);
    PJPF.set(0, 1, -f1);
    PJPF.set(1, 1, f0);
    return PJPF;
  }
}
