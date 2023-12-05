import Vector from "../linear-algebra/vector";

export default class Edge {
  public v1: Vector;
  public v2: Vector;

  // The edge between v1 and v2
  public edge: Vector;

  // The normalized edge
  public edgeNormalized: Vector;

  // The length of the edge
  public length: number;

  constructor(v1: Vector | number[], v2: Vector | number[]) {
    if (v1 instanceof Vector) {
      this.v1 = v1;
    } else {
      this.v1 = Vector.fromArray(v1);
    }

    if (v2 instanceof Vector) {
      this.v2 = v2;
    } else {
      this.v2 = Vector.fromArray(v2);
    }

    this.edge = this.v2.sub(this.v1);

    this.length = this.edge.norm();

    this.edgeNormalized = this.edge.normalized();
  }
}

export function verticesToEdges(vertices: Vector[] | number[][]): Edge[] {
  const edges: Edge[] = [];

  for (let i = 0; i < vertices.length - 1; i++) {
    const v1 = vertices[i];
    const v2 = vertices[i + 1];
    edges.push(new Edge(v1, v2));
  }

  return edges;
}
