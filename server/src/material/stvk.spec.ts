import { expect, test, describe } from "bun:test";
import STVK from "./stvk";
import Matrix from "../linear-algebra/matrix";

describe("STVK", () => {
  test("convergence", () => {
    const stvk = new STVK(1.0, 1.0);
    const randomF = Matrix.random(2, 2);
    expect(stvk.finiteDifferenceTestPK1(randomF)).toBe(true);
  });
});
