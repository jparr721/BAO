import Simulation from "./simulation";

export class SimCache {
  private static _instance: SimCache;

  private cache: Record<string, Simulation>;

  constructor() {
    this.cache = {};
  }

  public static instance(): SimCache {
    if (!SimCache._instance) {
      SimCache._instance = new SimCache();
    }
    return SimCache._instance;
  }

  public addSimulation(key: string, sim: Simulation) {
    this.cache[key] = sim;
  }
}

function addSimulationToCache(key: string, sim: Simulation): void {
  SimCache.instance().addSimulation(key, sim);
}

export function useSimCache(): [SimCache, typeof addSimulationToCache] {
  return [SimCache.instance(), addSimulationToCache];
}
