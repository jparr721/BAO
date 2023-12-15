export default interface GetSimulationCacheResponse {
  cache: {
    [key: string]: {
      availableFrames: number;
      simulation: {
        dt: number;
        mesh: {
          vertices: number;
          triangles: number;
          uniformMass: number;
          collisionEps: number;
        };
        material: {
          name: string;
          lambda: number;
          mu: number;
        };
        externalForces: number;
        velocity: number;
        rayleighAlpha: number;
        rayleighBeta: number;
      };
    };
  };
}
