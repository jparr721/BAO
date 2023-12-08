import { evaluateFPartialDerivative, triangleArea } from "./triangles";
import { NonLinearMaterial } from "../material/material";
import fs from "fs";
import Vector from "../linear-algebra/vector";
import Matrix from "../linear-algebra/matrix";

export default class TriangleMesh {
  // The simulation vertices (mutates)
  public vertices: Vector[];

  // Indexes into vertices which indicates that the vertex is on the surface.
  public surfaceVertices: number[];

  // The rest vertices (does not mutate)
  public restVertices: Vector[];

  // The full edge set
  public edges: number[][] = [];

  // The surface edges
  public surfaceEdges: number[];

  // The triangles within the 2D mesh
  public triangles: Vector[];

  // The N x 1 boolean vector indicating whether a vertex is pinned. This always matches the dimension of v.
  public pinnedVertices: boolean[];

  // The per-element deformation gradients
  public Fs: Matrix[];

  // The mass matrix
  public M: Matrix;

  // The inverse mass matrix
  public Minv: Matrix;

  // The rest configuration area
  public restAreas: number[];

  // The one-ring areas around each vertex
  public oneRingAreas: number[];

  // The per-element Dm inverses (for computing deformation gradients)
  private DmInverses: Matrix[];

  // The partial derivative of F with respect to x.
  private pFpxs: Matrix[];

  // The epislon collision envelope (minimum distance between points before initiating collision)
  private collisionEps: number;

  // Flag for whether or not to recompute the deformation gradient.
  public staleF = true;

  constructor(
    restVertices: Vector[],
    triangles: Vector[],
    uniformMass: number,
    collisionEps: number = 1e-3
  ) {
    this.vertices = restVertices;
    this.restVertices = restVertices;
    this.computeEdges();
    this.triangles = triangles;
    this.collisionEps = collisionEps;
    this.DmInverses = [...new Array(triangles.length)].map(() =>
      Matrix.zero(2, 2)
    );
    this.Fs = [...new Array(triangles.length)].map(() => Matrix.identity(2));
    this.restAreas = [...new Array(triangles.length)].map(() => 0.0);
    this.oneRingAreas = [...new Array(restVertices.length)].map(() => 0.0);
    this.pFpxs = [...new Array(triangles.length)].map(() => Matrix.zero(4, 6));
    this.pinnedVertices = [...new Array(this.restVertices.length)].map(
      () => false
    );

    this.surfaceEdges = [];
    this.surfaceVertices = [];

    // Compute the mass matrix
    this.M = Matrix.identity(this.DOFs()).mul(uniformMass);
    this.Minv = this.M.inv();

    // Precompute the DmInverse values
    for (let i = 0; i < this.triangles.length; i++) {
      const triangle = this.triangles[i];
      const v0 = this.vertices[triangle.get(0)];
      const v1 = this.vertices[triangle.get(1)];
      const v2 = this.vertices[triangle.get(2)];
      const Dm = Matrix.zero(2, 2);

      Dm.setCol(0, v1.sub(v0));
      Dm.setCol(1, v2.sub(v0));
      this.DmInverses[i] = Dm.inv();
    }

    for (let i = 0; i < this.triangles.length; i++) {
      this.pFpxs[i] = evaluateFPartialDerivative(this.DmInverses[i]);
    }

    this.computeAreas();
  }

  private computeAreas() {
    for (let i = 0; i < this.triangles.length; i++) {
      const triangle = this.triangles[i];
      const v0 = this.vertices[triangle.get(0)];
      const v1 = this.vertices[triangle.get(1)];
      const v2 = this.vertices[triangle.get(2)];
      const area = triangleArea(v0, v1, v2);
      this.restAreas[i] = area;
    }

    // Distribute the areas to the vertex one rings
    for (let i = 0; i < this.triangles.length; i++) {
      const triangle = this.triangles[i];
      const v0 = triangle.get(0);
      const v1 = triangle.get(1);
      const v2 = triangle.get(2);

      this.oneRingAreas[v0] += this.restAreas[i] / 3.0;
      this.oneRingAreas[v1] += this.restAreas[i] / 3.0;
      this.oneRingAreas[v2] += this.restAreas[i] / 3.0;
    }
  }

  private computeEdges() {
    this.edges = [];
    for (let i = 0; i < this.vertices.length - 1; i++) {
      this.edges.push([i, i + 1]);
    }
  }

  public computeMaterialForces(material: NonLinearMaterial): Vector {
    const perElementForces = [...new Array(this.triangles.length)].map(
      (_, t) => {
        const F = this.Fs[t];
        const PK1 = material.PK1(F);
        const forceDensity = this.pFpxs[t]
          .transpose()
          .mul(PK1.colwiseFlatten());

        return forceDensity.mul(-this.restAreas[t]);
      }
    );

    const forces = Vector.zero(this.DOFs());

    for (let i = 0; i < this.triangles.length; i++) {
      const t = this.triangles[i];
      const triForce = perElementForces[i];

      for (let x = 0; x < 3; x++) {
        const index = 2 * t.get(x);

        forces.set(index, forces.get(index) + triForce.get(2 * x));
        forces.set(index + 1, forces.get(index + 1) + triForce.get(2 * x + 1));
      }
    }

    return forces;
  }

  /**
   * Computes the deformation gradient for each triangle.
   */
  public computeDeformationGradients() {
    // Formula from Dynamic Deformables, appendix D.1
    for (let i = 0; i < this.triangles.length; i++) {
      const triangle = this.triangles[i];
      // The 'D' terms represent displacement in material versus spatial coordinates.
      // Here, the D matrices multiply to form the invariant deformation gradient.
      const Ds = Matrix.zero(2, 2);
      Ds.setCol(
        0,
        this.vertices[triangle.get(1)].sub(this.vertices[triangle.get(0)])
      );
      Ds.setCol(
        1,
        this.vertices[triangle.get(2)].sub(this.vertices[triangle.get(0)])
      );
      this.Fs[i] = Ds.mul(this.DmInverses[i]);
    }

    this.staleF = false;
  }

  public DOFs(): number {
    return this.vertices.length * 2;
  }

  /**
   * Returns the vertices as a single stacked vector where each entry of this.vertices is flattened.
   */
  public positions(): Vector {
    const positions = Vector.zero(this.DOFs());
    for (let i = 0; i < this.vertices.length; i++) {
      positions.set([i * 2, i * 2 + 1], this.vertices[i]);
    }
    return positions;
  }

  public setPositions(positions: Vector) {
    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i] = Vector.fromArray(positions.get([i * 2, i * 2 + 1]));
    }

    this.staleF = true;
  }

  public saveFrameToObj(filename: string) {
    const vertices = this.vertices.map((v) => v.values);
    const faces = this.triangles.map((t) => t.values);

    let objFileContent = "";
    for (let i = 0; i < vertices.length; i++) {
      objFileContent += `v ${vertices[i][0]} ${vertices[i][1]} 0\n`;
    }

    for (let i = 0; i < faces.length; i++) {
      objFileContent += `f ${faces[i][0] + 1} ${faces[i][1] + 1} ${
        faces[i][2] + 1
      }\n`;
    }

    fs.writeFileSync(filename, objFileContent);
  }
}
