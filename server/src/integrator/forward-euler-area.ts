import { constructDiagonalSparseMatrix } from "../geometry/triangles";
import Matrix from "../linear-algebra/matrix";
import Vector from "../linear-algebra/vector";
import AreaIntegrator from "./area-intergrator";

export default class ForwardEulerArea extends AreaIntegrator {
  public step(): void {
    // Compute latest deformation gradients
    this.mesh.computeDeformationGradients();

    // Compute the material forces
    const R = this.mesh.computeMaterialForces(this.material);

    // Compute the update
    const dt2 = this.dt * this.dt;
    const massMat = this.mesh.Minv.mul(dt2);
    const internalExternalForce = R.add(this.externalForces);

    const velocityUpdate = this.velocity.mul(this.dt);

    let update = massMat.mul(internalExternalForce).add(velocityUpdate);

    const perVertexPinned = Vector.one(this.mesh.DOFs());
    for (let i = 0; i < this.mesh.pinnedVertices.length; i++) {
      if (this.mesh.pinnedVertices[i]) {
        perVertexPinned.set([i * 2, i * 2 + 1], [0, 0]);
      }
    }

    const filter = constructDiagonalSparseMatrix(perVertexPinned);
    const positions = this.mesh.positions();
    update = filter.mul(update);
    const dx = update.clone();
    update.addInPlace(positions);
    this.mesh.setPositions(update);
    this.velocity = dx.div(this.dt);
    this.velocity = filter.mul(this.velocity);
  }
}
