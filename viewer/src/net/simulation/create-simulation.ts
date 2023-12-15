import CreateSimulation from "../../models/simulation/create-simulation.type";
import endpoint from "../endpoint";
import post from "../post";

const createSimulation = (simulation: CreateSimulation) =>
  post<CreateSimulation, CreateSimulation>(
    endpoint("sim", "create"),
    simulation
  );
export default createSimulation;
