import { TriangleMesh } from "../geometry/triangle-mesh";
import { LinearMaterial } from "../material/material";
import * as math from "mathjs";

export default abstract class SpringIntegrator {
  public dt: number;

  public mesh: TriangleMesh;

  public material: LinearMaterial;

  public externalForces: math.Matrix;

  public velocity: math.Matrix;

  protected rayleighAlpha: number = 0.0;

  protected rayleighBeta: number = 0.0;

  constructor(
    mesh: TriangleMesh,
    material: LinearMaterial,
    dt: number,
    rayleighAlpha: number,
    rayleighBeta: number
  ) {
    this.dt = dt;
    this.mesh = mesh;
    this.material = material;
    this.externalForces = math.matrix(math.zeros([mesh.DOFs(), 1]));
    this.velocity = math.matrix(math.zeros([mesh.DOFs(), 1]));
    this.rayleighAlpha = rayleighAlpha;
    this.rayleighBeta = rayleighBeta;
  }

  abstract step(): void;

  public addGravity(gravity: math.Matrix | number[]): void {
    this.externalForces = math.matrix(math.zeros([this.mesh.DOFs(), 1]));
    for (let i = 0; i < this.mesh.vertices.length; i++) {
      this.externalForces.subset(math.index([i * 2, i * 2 + 1], [0]), gravity);
    }
  }
}
