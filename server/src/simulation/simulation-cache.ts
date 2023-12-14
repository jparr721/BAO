import Simulation from "./simulation";

export class SimCache {
  private static _instance: SimCache;

  private cache: Record<string, Simulation>;

  constructor() {
    this.cache = {};
  }

  public toString(): string {
    let cacheString = "SimCache(";

    for (const key in this.cache) {
      cacheString += `${key}: ${this.cache[key].toString()}, `;
    }

    return cacheString;
  }

  public static instance(): SimCache {
    if (!SimCache._instance) {
      SimCache._instance = new SimCache();
    }
    return SimCache._instance;
  }

  public addSimulation(key: string, sim: Simulation) {
    if (this.exists(key)) {
      throw new Error(`Simulation with key '${key}' already exists.`);
    }
    this.cache[key] = sim;
  }

  public exists(key: string): boolean {
    return !!this.cache[key];
  }
}

function addSimulationToCache(key: string, sim: Simulation): void {
  SimCache.instance().addSimulation(key, sim);
}

export function useSimCache(): [SimCache, typeof addSimulationToCache] {
  return [SimCache.instance(), addSimulationToCache];
}
