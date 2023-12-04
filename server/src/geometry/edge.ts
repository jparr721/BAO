import { Matrix, matrix, norm, subtract, divide } from "mathjs";
import { l2Norm } from "./triangles";

export default class Edge {
  public v1: Matrix;
  public v2: Matrix;

  // The edge between v1 and v2
  public edge: Matrix;

  // The normalized edge
  public edgeNormalized: Matrix;

  // The length of the edge
  public length: number;

  constructor(v1: Matrix | number[], v2: Matrix | number[]) {
    if (v1 instanceof Matrix) {
      this.v1 = v1;
    } else {
      this.v1 = matrix(v1);
    }

    if (v2 instanceof Matrix) {
      this.v2 = v2;
    } else {
      this.v2 = matrix(v2);
    }

    this.edge = subtract(this.v2, this.v1);

    this.length = l2Norm(this.edge);

    this.edgeNormalized = this.edge.map((x: number) => divide(x, this.length));
  }
}

export function verticesToEdges(vertices: Matrix[] | number[][]): Edge[] {
  const edges: Edge[] = [];

  for (let i = 0; i < vertices.length - 1; i++) {
    const v1 = vertices[i];
    const v2 = vertices[i + 1];
    edges.push(new Edge(v1, v2));
  }

  return edges;
}
