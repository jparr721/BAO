import {
  NSVGimage,
  NSVGshape,
  NSVGpath,
  nsvgParseFromFile,
} from "../ext/nanosvg";
import Vector from "../linear-algebra/vector";
import path from "path";
import fs from "fs";

function getBoundingBox(nodes: Vector[]): { min: Vector; max: Vector } {
  const min = nodes[0].clone();
  const max = nodes[0].clone();

  for (const node of nodes) {
    min.x = Math.min(min.x, node.x);
    min.y = Math.min(min.y, node.y);
    max.x = Math.max(max.x, node.x);
    max.y = Math.max(max.y, node.y);
  }

  return { min, max };
}

export default function svgToPoly(filename: string) {
  const image: NSVGimage = nsvgParseFromFile(
    filename,
    "px",
    96
  ) as unknown as NSVGimage;

  let shapes: NSVGshape = image.shapes;
  let nodes = [];

  while (shapes !== null) {
    let paths: NSVGpath = shapes.paths;

    while (paths !== null) {
      const npts = paths.npts;

      // iterate npts in twos and push to nodes as a pair
      for (let i = 0; i < npts - 1; i += 2) {
        const p0 = paths.pts[i];
        const p1 = paths.pts[i + 1];

        nodes.push(Vector.fromArray([p0, p1]));
      }

      paths = paths.next;
    }

    shapes = shapes.next;
  }

  const { min, max } = getBoundingBox(nodes);
  const center = min.add(max).mul(0.5);
  const diff = max.sub(min);

  const scale = diff.x > diff.y ? diff.x : diff.y;

  nodes = nodes.map((node) => {
    const transformed = node.sub(center).div(scale);
    transformed.y *= -1;
    return transformed;
  });

  // Write the file to the meshes folder
  const MESH_DIR = path.join(import.meta.dir, "..", "..", "meshes");
  const basename = path.parse(filename).name;
  const outputFilename = path.join(MESH_DIR, `${basename}.json`);

  const fileContent = {
    vertices: nodes.map((node) => node.values),
    indices: nodes
      .slice(0, -1)
      .map((_, index) => [index, index + 1, index + 2]),
  };

  // Write the file
  fs.writeFileSync(outputFilename, JSON.stringify(fileContent));
}
