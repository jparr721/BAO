import { NSVGimage, NSVGshape, NSVGpath } from "../src/ext/nanosvg";
import svgToPoly from "../src/geometry/svg-to-poly";

function usage() {
  console.log("Usage: bun run svg-to-poly <filename>");
}

(() => {
  if (process.argv.length < 3) {
    usage();
    process.exit(1);
  }

  const filename = process.argv[2];
  svgToPoly(filename);
})();
