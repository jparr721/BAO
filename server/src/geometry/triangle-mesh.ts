import { triangleArea } from "./triangles";
import { LinearMaterial, NonLinearMaterial } from "../material/material";
import fs from "fs";
import Vector from "../linear-algebra/vector";
import Matrix from "../linear-algebra/matrix";
import { isEqual } from "lodash";

export class TriangleMesh {
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

  // The per-element Dm inverses (for computing deformation gradients)
  private DmInverses: Matrix[];

  // The partial derivative of F with respect to x.
  private pFpxs: Matrix[];

  // The rest configuration area
  private restAreas: number[];

  // The one-ring areas around each vertex
  private oneRingAreas: number[];

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
    this.M = Matrix.identity(this.vertices.length * 2).mul(uniformMass);
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

    // this.computeAreas();
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

  private computeLinearMaterialForces(material: LinearMaterial) {
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

  private computeNonLinearMaterialForces(material: NonLinearMaterial): Vector {
    throw new Error("Not supported");
  }

  public computeMaterialForces(
    material: LinearMaterial | NonLinearMaterial
  ): Vector {
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
    // // Formula from Dynamic Deformables, appendix D.1
    // for (let i = 0; i < this.triangles.length; i++) {
    //   const triangle = this.triangles[i];
    //   // The 'D' terms represent displacement in material versus spatial coordinates.
    //   // Here, the D matrices multiply to form the invariant deformation gradient.
    //   const Ds = math.matrix(math.zeros([2, 2]));
    //   setMatrixColumn(
    //     Ds,
    //     math.subtract(
    //       this.vertices[triangle.get([1])],
    //       this.vertices[triangle.get([0])]
    //     ),
    //     0
    //   );
    //   setMatrixColumn(
    //     Ds,
    //     math.subtract(
    //       this.vertices[triangle.get([2])],
    //       this.vertices[triangle.get([0])]
    //     ),
    //     1
    //   );
    //   this.Fs[i] = math.multiply(Ds, this.DmInverses[i]);
    // }
    // this.staleF = false;
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
