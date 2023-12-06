import { TriangleMesh } from "../geometry/triangle-mesh";
import { constructDiagonalSparseMatrix } from "../geometry/triangles";
import Vector from "../linear-algebra/vector";
import { LinearMaterial } from "../material/material";
import SpringIntegrator from "./spring-integrator";

export default class ForwardEulerSpring extends SpringIntegrator {
  constructor(
    mesh: TriangleMesh,
    material: LinearMaterial,
    dt: number = 1.0 / 3000.0,
    rayleighAlpha: number = 0.0,
    rayleighBeta: number = 0.0
  ) {
    super(mesh, material, dt, rayleighAlpha, rayleighBeta);
  }

  public step(): void {
    // Get new Fs
    // this.mesh.computeDeformationGradients();
    this.mesh.staleF = false;

    // Compute the forces
    const R = this.mesh.computeMaterialForces(this.material);

    // Compute the update
    const dt2 = this.dt * this.dt;
    const internalExternalForce = R.add(this.externalForces);
    const velocityTerm = this.velocity.mul(this.dt);

    let u = this.mesh.Minv.mul(dt2)
      .mul(internalExternalForce)
      .add(velocityTerm);

    // Pin any pinned vertices
    const pinned = Vector.one(this.mesh.DOFs());
    for (let i = 0; i < this.mesh.pinnedVertices.length; i++) {
      const index = this.mesh.pinnedVertices[i];
      if (index) {
        pinned.set([i * 2, i * 2 + 1], [0, 0]);
      }
    }

    const filter = constructDiagonalSparseMatrix(pinned);

    // Velocity update
    this.velocity = u.div(this.dt);

    // Filter out the pinned velocities.
    this.velocity = filter.mul(this.velocity);

    const positions = this.mesh.positions();
    u = filter.mul(u);
    u.addInPlace(positions);
    this.mesh.setPositions(u);
  }
}
