export default interface CreateSimulation {
  simulationName: string;
  meshName: string;
  energyType: string;
  dt: number;
  youngsModulus: number;
  poissonsRatio: number;
  materialMass: number;
  collisionEps: number;
  rayleighAlpha: number;
  rayleighBeta: number;
  gravity: number[];
}
