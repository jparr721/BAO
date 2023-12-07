import { constructDiagonalSparseMatrix } from "../geometry/triangles";
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
    const internalExternalForce = R.add(this.externalForces);
    const velocityUpdate = this.velocity.mul(this.dt);

    let u = this.mesh.Minv.mul(dt2)
      .mul(internalExternalForce)
      .add(velocityUpdate);

    const perVertexPinned = Vector.one(this.mesh.DOFs());
    // for (let i = 0; i < this.mesh.pinnedVertices.length; i++) {
    //   if (this.mesh.pinnedVertices[i]) {
    //     perVertexPinned.set([i * 2, i * 2 + 1], [0, 0]);
    //   }
    // }
    const filter = constructDiagonalSparseMatrix(perVertexPinned);
    u = filter.mul(u);
    const dx = u;
    u.addInPlace(this.mesh.positions());
    this.mesh.setPositions(u);

    // Velocity update
    this.velocity = dx.div(this.dt);
    this.velocity = filter.mul(this.velocity);
  }
}
