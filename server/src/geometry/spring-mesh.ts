import Matrix from "../linear-algebra/matrix";
import Vector from "../linear-algebra/vector";
import { LinearMaterial } from "../material/material";
import fs from "fs";

export default class SpringMesh {
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

  // The mass matrix
  public M: Matrix;

  // The inverse mass matrix
  public Minv: Matrix;

  // The epislon collision envelope (minimum distance between points before initiating collision)
  private collisionEps: number;

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
    this.pinnedVertices = [...new Array(this.restVertices.length)].map(
      () => false
    );

    this.surfaceEdges = [];
    this.surfaceVertices = [];

    // Compute the mass matrix
    this.M = Matrix.identity(this.vertices.length * 2).mul(uniformMass);
    this.Minv = this.M.inv();
  }

  private computeEdges() {
    this.edges = [];
    for (let i = 0; i < this.vertices.length - 1; i++) {
      this.edges.push([i, i + 1]);
    }
  }

  public computeMaterialForces(material: LinearMaterial): Vector {
    const perElementForces = [...new Array(this.edges.length)].map((_, i) => {
      const edgeIndex = this.edges[i];
      const v1 = this.vertices[edgeIndex[0]];
      const v2 = this.vertices[edgeIndex[1]];
      const length = v2.sub(v1).norm();

      // Stack the vertices into a 4x1 matrix
      const x = Vector.zero(4);
      x.set([0, 1], v1.values);
      x.set([2, 3], v2.values);

      const pk1 = material.PK1(x);
      return pk1.mul(-length);
    });

    // Convert per-element forces into one large vector
    const R = Vector.zero(this.DOFs());
    for (let i = 0; i < this.edges.length; i++) {
      const force = perElementForces[i];

      for (let j = 0; j < 2; j++) {
        const index = this.edges[i][j];
        R.set([index * 2, index * 2 + 1], force.get([j * 2, j * 2 + 1]));
      }
    }

    return R;
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
      positions.set([i * 2, i * 2 + 1], this.vertices[i].values);
    }
    return positions;
  }

  public setPositions(positions: Vector) {
    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i] = Vector.fromArray(positions.get([i * 2, i * 2 + 1]));
    }
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
