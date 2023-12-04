import { expect, test, describe } from "bun:test";
import MassSpring from "./mass-spring";
import * as math from "mathjs";

describe("MassSpring", () => {
  test("psi", () => {});

  test("convergence", () => {
    const massSpring = new MassSpring(1.0, 1.0);
    const randomX = math.matrix(math.random([4, 1]));
    expect(massSpring.finiteDifferenceTestForces(randomX)).toBe(true);
  });
});
