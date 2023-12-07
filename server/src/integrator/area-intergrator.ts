import TriangleMesh from "../geometry/triangle-mesh";
import Vector from "../linear-algebra/vector";
import { NonLinearMaterial } from "../material/material";

export default abstract class AreaIntegrator {
  public dt: number;

  public mesh: TriangleMesh;

  public material: NonLinearMaterial;

  public externalForces: Vector;

  public velocity: Vector;

  protected rayleighAlpha: number = 0.0;

  protected rayleighBeta: number = 0.0;

  constructor(
    mesh: TriangleMesh,
    material: NonLinearMaterial,
    dt: number,
    rayleighAlpha: number = 0,
    rayleighBeta: number = 0
  ) {
    this.dt = dt;
    this.mesh = mesh;
    this.material = material;
    this.externalForces = Vector.zero(mesh.DOFs());
    this.velocity = Vector.zero(mesh.DOFs());
    this.rayleighAlpha = rayleighAlpha;
    this.rayleighBeta = rayleighBeta;
  }

  abstract step(): void;

  public addGravity(gravity: Vector): void {
    this.externalForces = Vector.zero(this.mesh.DOFs());
    for (let i = 0; i < this.mesh.vertices.length; i++) {
      this.externalForces.set([i * 2, i * 2 + 1], gravity);
    }
  }
}
