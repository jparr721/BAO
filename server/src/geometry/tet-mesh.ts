import { readTetMesh } from "../io";
import * as math from "mathjs";
import { matrixSize } from "../utils";

export default class TetMesh {
  // Simulation vertices
  public v: math.Matrix;

  // The rest vertices
  public rv: math.Matrix;

  // The surface faces
  public f: math.Matrix;

  // Surface/interior tetrahedra
  public t: math.Matrix;

  // The mass matrix
  public M: math.Matrix;

  // The inverse mass matrix
  public Minv: math.Matrix;

  // The damping matrix
  public C: math.Matrix;

  // The per-element deformation gradients
  public Fs: math.Matrix[];

  // The N x 1 boolean vector indicating whether a vertex is pinned. This always matches the dimension of v.
  public pinnedVertices: boolean[];

  // The per-element Dm inverses (for computing deformation gradients)
  private DmInverses: math.Matrix[];

  // The partial derivative of F with respect to x.
  private pFpxs: math.Matrix[];

  // The rest configuration volumes
  private restVolumes: number[];

  // The one-ring areas around each vertex
  private oneRingAreas: number[];

  constructor(filepath: string) {
    const [vertices, tetrahedra] = readTetMesh(filepath);

    // Generate the faces by getting all faces with a count < 2
    const faces = TetMesh.generateFaces(vertices, tetrahedra);

    // Turn everything into a matrix
    this.v = math.matrix(vertices);
    this.rv = math.matrix(vertices);
    this.f = math.matrix(faces);

    // Identity returns a vague type, so we cast to a matrix here
    this.M = math.identity([this.DOFs(), this.DOFs()], "sparse") as math.Matrix;

    // All vertices start un-pinned
    this.pinnedVertices = [...Array(matrixSize(this.v).rows)].map(() => false);
  }

  private computeDmInverses() {
    for (let i = 0; i < matrixSize(this.t).rows; i++) {
      const tet = this.t.sub;
    }
  }

  private computepFpxs() {}

  public DOFs(): number {
    return math.prod(math.size(this.v)) as number;
  }

  public static generateFaces(
    vertices: number[][],
    tetrahedra: number[][]
  ): number[][] {
    const faces: number[][] = [];
    if (vertices.length === 0) {
      return [];
    }

    if (tetrahedra.length === 0) {
      return [];
    }

    // The face counts are a map from a face to the number of times it appears. The face is always sorted.
    let faceCount: Map<string, number> = new Map();

    for (let i = 0; i < tetrahedra.length; i++) {
      const tet = tetrahedra[i];
      const tempFaces = [
        [tet[0], tet[1], tet[2]],
        [tet[0], tet[2], tet[1]],
        [tet[0], tet[3], tet[2]],
        [tet[1], tet[2], tet[3]],
      ]
        .map((face) => face.sort())
        .map((face) => face.toString());

      tempFaces.forEach((face) => {
        faceCount.set(face, (faceCount.get(face) ?? 0) + 1);
      });
    }

    // Go back through the tets, if any of its faces have a count less than 2, then we know it is on the surface
    for (let i = 0; i < tetrahedra.length; i++) {
      const tet = tetrahedra[i];
      const tempFaces = [
        [tet[0], tet[1], tet[2]],
        [tet[0], tet[2], tet[1]],
        [tet[0], tet[3], tet[2]],
        [tet[1], tet[2], tet[3]],
      ];

      const tempFacesSorted = tempFaces
        .map((face) => face.sort())
        .map((face) => face.toString());

      for (let i = 0; i < 4; i++) {
        if (faceCount.get(tempFacesSorted[i]) === 1) {
          faces.push(tempFaces[i]);
        }
      }
    }

    console.debug(
      `Got ${faces.length} faces from ${tetrahedra.length * 4} tets`
    );

    return faces;
  }
}
