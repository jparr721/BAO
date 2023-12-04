import * as math from "mathjs";
import { setMatrixColumn } from "../utils";
import { triangleArea } from "./triangles";
import { LinearMaterial, NonLinearMaterial } from "../material/material";
import fs from "fs";

export class TriangleMesh {
  // The simulation vertices (mutates)
  public vertices: math.Matrix[];

  // Indexes into vertices which indicates that the vertex is on the surface.
  public surfaceVertices: number[];

  // The rest vertices (does not mutate)
  public restVertices: math.Matrix[];

  // The full edge set
  public edges: number[][] = [];

  // The surface edges
  public surfaceEdges: number[];

  // The triangles within the 2D mesh
  public triangles: math.Matrix[];

  // The N x 1 boolean vector indicating whether a vertex is pinned. This always matches the dimension of v.
  public pinnedVertices: boolean[];

  // The per-element deformation gradients
  public Fs: math.Matrix[];

  // The mass matrix
  public M: math.Matrix;

  // The inverse mass matrix
  public Minv: math.Matrix;

  // The per-element Dm inverses (for computing deformation gradients)
  private DmInverses: math.Matrix[];

  // The partial derivative of F with respect to x.
  private pFpxs: math.Matrix[];

  // The rest configuration area
  private restAreas: number[];

  // The one-ring areas around each vertex
  private oneRingAreas: number[];

  // The epislon collision envelope (minimum distance between points before initiating collision)
  private collisionEps: number;

  // Flag for whether or not to recompute the deformation gradient.
  public staleF = true;

  constructor(
    restVertices: math.Matrix[],
    triangles: math.Matrix[],
    uniformMass: number,
    collisionEps: number = 1e-3
  ) {
    this.vertices = restVertices;
    this.restVertices = restVertices;
    this.computeEdges();
    this.triangles = triangles;
    this.collisionEps = collisionEps;
    this.DmInverses = [...new Array(triangles.length)].map(() =>
      math.matrix(math.zeros([2, 2]))
    );
    this.Fs = [...new Array(triangles.length)].map(
      () => math.identity(2) as math.Matrix
    );
    this.restAreas = [...new Array(triangles.length)].map(() => 0.0);
    this.oneRingAreas = [...new Array(restVertices.length)].map(() => 0.0);
    this.pFpxs = [...new Array(triangles.length)].map(() =>
      math.matrix(math.zeros([4, 6]))
    );
    this.pinnedVertices = [...new Array(this.restVertices.length)].map(
      () => false
    );

    this.surfaceEdges = [];
    this.surfaceVertices = [];

    // Compute the mass matrix
    this.M = math.multiply(
      math.identity(this.vertices.length * 2, "sparse"),
      uniformMass
    ) as math.Matrix;
    this.Minv = math.inv(this.M);

    // Precompute the DmInverse values
    for (let i = 0; i < this.triangles.length; i++) {
      const triangle = this.triangles[i];
      const v0 = this.vertices[triangle.get([0])];
      const v1 = this.vertices[triangle.get([1])];
      const v2 = this.vertices[triangle.get([2])];
      const Dm = math.matrix(math.zeros([2, 2]));

      setMatrixColumn(Dm, math.subtract(v1, v0), 0);
      setMatrixColumn(Dm, math.subtract(v2, v0), 1);
      this.DmInverses[i] = math.inv(Dm);
    }

    // this.computeAreas();
  }

  private computeAreas() {
    for (let i = 0; i < this.triangles.length; i++) {
      const triangle = this.triangles[i];
      const v0 = this.vertices[triangle.get([0])];
      const v1 = this.vertices[triangle.get([1])];
      const v2 = this.vertices[triangle.get([2])];
      const area = triangleArea(v0, v1, v2);
      this.restAreas[i] = area;
    }

    // Distribute the areas to the vertex one rings
    for (let i = 0; i < this.triangles.length; i++) {
      const triangle = this.triangles[i];
      const v0 = triangle.get([0]);
      const v1 = triangle.get([1]);
      const v2 = triangle.get([2]);

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

  private computeLinearMaterialForces(material: LinearMaterial) {
    const perElementForces = [...new Array(this.edges.length)].map((_, i) => {
      const edgeIndex = this.edges[i];
      const v1 = math.clone(this.vertices[edgeIndex[0]]);
      const v2 = math.clone(this.vertices[edgeIndex[1]]);
      const length = math.norm(math.subtract(v2, v1));

      // Stack the vertices into a 4x1 matrix
      const x = math.zeros(4) as math.Matrix;

      x.subset(math.index([0, 1], [0]), v1);
      x.subset(math.index([2, 3], [0]), v2);

      const pk1 = material.PK1(x);
      return math.multiply(-length, pk1);
    });

    // Convert per-element forces into one large vector
    const R = math.zeros(this.DOFs()) as math.Matrix;
    for (let i = 0; i < this.edges.length; i++) {
      const force = perElementForces[i];

      for (let j = 0; j < 2; j++) {
        const index = this.edges[i][j];
        R.set([index * 2, 0], force.get([j * 2, 0]));
        R.set([index * 2 + 1, 0], force.get([j * 2 + 1, 0]));
      }
    }

    return R;
  }

  private computeNonLinearMaterialForces(
    material: NonLinearMaterial
  ): math.Matrix {
    throw new Error("Not supported");
  }

  public computeMaterialForces(
    material: LinearMaterial | NonLinearMaterial
  ): math.Matrix {
    if (this.staleF) {
      throw new Error("Cannot compute material forces without updated F");
    }

    if (material instanceof LinearMaterial) {
      return this.computeLinearMaterialForces(material);
    } else {
      return this.computeNonLinearMaterialForces(material);
    }
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
      const Ds = math.matrix(math.zeros([2, 2]));
      setMatrixColumn(
        Ds,
        math.subtract(
          this.vertices[triangle.get([1])],
          this.vertices[triangle.get([0])]
        ),
        0
      );
      setMatrixColumn(
        Ds,
        math.subtract(
          this.vertices[triangle.get([2])],
          this.vertices[triangle.get([0])]
        ),
        1
      );
      this.Fs[i] = math.multiply(Ds, this.DmInverses[i]);
    }

    this.staleF = false;
  }

  public DOFs(): number {
    return this.vertices.length * 2;
  }

  /**
   * Returns the vertices as a single stacked vector where each entry of this.vertices is flattened.
   */
  public positions(): math.Matrix {
    const positions = math.matrix(math.zeros(this.DOFs()));
    for (let i = 0; i < this.vertices.length; i++) {
      positions.subset(math.index([i * 2, i * 2 + 1], [0]), this.vertices[i]);
    }
    return positions;
  }

  public setPositions(positions: math.Matrix) {
    for (let i = 0; i < this.vertices.length; i++) {
      const data = positions.subset(math.index([i * 2, i * 2 + 1], [0]))._data;
      this.vertices[i] = math.matrix([data[0][0], data[1][0]]);
    }
    this.staleF = true;
  }

  public saveFrameToObj(filename: string) {
    const vertices = this.vertices.map((v) => v._data);
    const faces = this.triangles.map((t) => t._data);

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
