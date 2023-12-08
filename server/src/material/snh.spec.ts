import { describe, test, expect } from "bun:test";
import SNH from "./snh";
import Matrix from "../linear-algebra/matrix";

describe("SNH", () => {
  test("convergence", () => {
    const snh = new SNH(1.0, 1.0);
    const randomF = Matrix.random(2, 2);
    expect(snh.finiteDifferenceTestPK1(randomF)).toBe(true);
  });
});
