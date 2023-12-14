import CreateSimulation from "../controllers/sim/create-simulation.type";
import readMeshFromStoreByName from "../geometry/read-mesh-store";
import TriangleMesh from "../geometry/triangle-mesh";
import ForwardEulerArea from "../integrator/forward-euler-area";
import Vector from "../linear-algebra/vector";
import { computeLambda, computeMu } from "../material/material";
import SNH from "../material/snh";
import STVK from "../material/stvk";
import { SimulationFrame, SimulationPayload } from "./simulation-payload.type";

export default class Simulation {
  private frameno: number = -1;
  public mesh: TriangleMesh;
  public energy: SNH | STVK;
  public integrator: ForwardEulerArea;

  constructor(
    mesh: TriangleMesh,
    energy: SNH | STVK,
    integrator: ForwardEulerArea
  ) {
    this.frameno = -1;
    this.mesh = mesh;
    this.energy = energy;
    this.integrator = integrator;
  }

  public static fromOptions(options: CreateSimulation) {
    const { vertices, indices } = readMeshFromStoreByName(options.meshName);
    const mesh = new TriangleMesh(
      vertices,
      indices,
      options.materialMass ? options.materialMass : 5.0,
      options.collisionEps ? options.collisionEps : 1e-3
    );

    const energy = ((type: string) => {
      const lambda = computeLambda(
        options.youngsModulus,
        options.poissonsRatio
      );

      const mu = computeMu(options.youngsModulus, options.poissonsRatio);

      switch (type) {
        case "snh":
          return new SNH(lambda, mu);
        case "stvk":
          return new STVK(lambda, mu);
        default:
          throw new Error(`Invalid energy type '${type}' received.`);
      }
    })(options.energyType);

    const integrator = new ForwardEulerArea(mesh, energy, options.dt);

    return new Simulation(mesh, energy, integrator);
  }

  public toString() {
    return `Simulation(${this.mesh.toString()}, ${this.energy.toString()}, ${this.integrator.toString()})`;
  }

  public addGravity(g: Vector) {
    this.integrator.addGravity(g);
  }

  public addPlanePinConstraint(plane: Vector) {}

  public step(frameSize: number): SimulationFrame {
    for (let i = 0; i < frameSize; i++) {
      this.integrator.step();
    }

    const vertices = this.integrator.mesh.vertices.map((v) => v.values).flat();
    let indices: number[] = [];

    // Only send indices on the first frame
    if (this.frameno == -1) {
      indices = this.integrator.mesh.triangles.map((v) => v.values).flat();
    }

    return {
      frameno: this.frameno++,
      vertices,
      indices,
    };
  }

  public batch(frameSize: number, nframes: number): SimulationPayload {
    const frames = new Array(nframes).map(() => this.step(frameSize));

    return { frames };
  }
}
