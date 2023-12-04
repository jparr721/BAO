import { TriangleMesh } from "../geometry/triangle-mesh";
import { constructDiagonalSparseMatrix, l2Norm } from "../geometry/triangles";
import { LinearMaterial } from "../material/material";
import { matrixSize } from "../utils";
import SpringIntegrator from "./spring-integrator";
import * as math from "mathjs";

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

    // console.log("R norm:", l2Norm(R));
    // console.log("velocity norm:", l2Norm(this.velocity));

    // Compute the update
    const dt2 = this.dt * this.dt;
    const internalExternalForce = math.add(R, this.externalForces);
    const velocityTerm = math.add(this.dt, this.velocity);

    let u = math.add(
      math.multiply(math.multiply(dt2, this.mesh.Minv), internalExternalForce),
      velocityTerm
    ) as math.Matrix;

    // Sanity check
    if (matrixSize(u).rows !== this.mesh.DOFs()) {
      throw new Error(
        `Size of u ${
          matrixSize(u).rows
        } does not match DOFs ${this.mesh.DOFs()}`
      );
    }

    // Pin any pinned vertices
    const pinned = math.matrix(math.zeros([this.mesh.DOFs(), 1]));
    for (let i = 0; i < this.mesh.pinnedVertices.length; i++) {
      const index = this.mesh.pinnedVertices[i];
      if (index) {
        pinned.subset(math.index([i * 2, i * 2 + 1], [0]), 0);
      }
    }

    const filter = constructDiagonalSparseMatrix(pinned);

    // Velocity update
    this.velocity = math.divide(u, this.dt) as math.Matrix;

    // Filter out the pinned velocities.
    this.velocity = math.multiply(filter, this.velocity) as math.Matrix;

    const positions = this.mesh.positions();
    u = math.multiply(filter, u) as math.Matrix;
    u = math.add(positions, u) as math.Matrix;
    this.mesh.setPositions(u);
  }
}
