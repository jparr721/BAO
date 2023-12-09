import TriangleMesh from "../geometry/triangle-mesh";
import ForwardEulerArea from "../integrator/forward-euler-area";
import Vector from "../linear-algebra/vector";
import SNH from "../material/snh";
import STVK from "../material/stvk";

export default class Simulation {
  public mesh: TriangleMesh;
  public energy: SNH | STVK;
  public integrator: ForwardEulerArea;

  constructor(
    mesh: TriangleMesh,
    energy: SNH | STVK,
    integrator: ForwardEulerArea
  ) {
    this.mesh = mesh;
    this.energy = energy;
    this.integrator = integrator;
  }

  public addGravity(g: Vector) {
    this.integrator.addGravity(g);
  }

  public addPlanePinConstraint(plane: Vector) {}

  public step(frameSize: number) {
    for (let i = 0; i < frameSize; i++) {
      this.integrator.step();
    }
  }
}
