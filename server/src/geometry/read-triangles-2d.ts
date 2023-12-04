import { readFileSync, existsSync } from "fs";
import * as math from "mathjs";

function readNodeFile(filename: string): math.Matrix[] {
  // Open filename and read it line by line
  return readFileSync(filename, "utf-8")
    .split(/\r?\n/)
    .map((line, i) => {
      // First line just has the file details
      if (i === 0) {
        return undefined;
      }

      // If the line starts with '#' ignore it
      if (line.startsWith("#")) {
        return undefined;
      }

      // Otherwise, it should be a node which is a line of 4 numbers, the first
      // three are index, position[0], position[1]. We just need those 3
      const split = line.split(" ").filter((x) => x !== "");
      if (split.length >= 3) {
        const x = parseFloat(split[1]);
        const y = parseFloat(split[2]);
        return math.matrix([x, y]);
      }
    })
    .filter((x) => x !== undefined) as math.Matrix[];
}

function readEleFile(filename: string): math.Matrix[] {
  return readFileSync(filename, "utf-8")
    .split(/\r?\n/)
    .map((line, i) => {
      // First line just has the file details
      if (i === 0) {
        return undefined;
      }

      // If the line starts with '#' ignore it
      if (line.startsWith("#")) {
        return undefined;
      }

      // The indices are 1-indexed, subtract off
      const split = line.split(" ").filter((x) => x !== "");
      if (split.length >= 4) {
        const i = parseInt(split[1]) - 1;
        const j = parseInt(split[2]) - 1;
        const k = parseInt(split[3]) - 1;
        return math.matrix([i, j, k]);
      }
    })
    .filter((x) => x !== undefined) as math.Matrix[];
}

export default function readTriangles2D(prefix: string): {
  vertices: math.Matrix[];
  triangles: math.Matrix[];
} {
  // Loads a volumetric triangle mesh from node/ele format (i.e. del triangualtion).
  const nodeFile = prefix + ".node";
  const elementFile = prefix + ".ele";

  // Check that both of these file exist
  if (!existsSync(nodeFile)) {
    throw new Error(`Could not find node file ${nodeFile}`);
  }

  if (!existsSync(elementFile)) {
    throw new Error(`Could not find element file ${elementFile}`);
  }

  return {
    vertices: readNodeFile(nodeFile),
    triangles: readEleFile(elementFile),
  };
}
