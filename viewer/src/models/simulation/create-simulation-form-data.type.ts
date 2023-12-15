import CreateSimulation from "./create-simulation.type";

export default interface CreateSimulationFormData
  extends Omit<CreateSimulation, "gravity"> {
  gravityx: number;
  gravityy: number;
}
