import { expect, test, describe } from "bun:test";
import MassSpring from "./mass-spring";
import Vector from "../linear-algebra/vector";

describe("MassSpring", () => {
  test("psi", () => {});

  test("convergence", () => {
    const massSpring = new MassSpring(1.0, 1.0);
    const randomX = Vector.random(4);
    expect(massSpring.finiteDifferenceTestForces(randomX)).toBe(true);
  });
});
