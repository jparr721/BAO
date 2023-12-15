import Simulation, { SimulationJSONPayload } from "./simulation";

export interface SimulationCachePayload {
  [key: string]: SimulationJSONPayload;
}

export class SimulationCache {
  private static _instance: SimulationCache;

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

  public toJSON(): SimulationCachePayload {
    const payload: SimulationCachePayload = {};

    for (const key in this.cache) {
      payload[key] = this.cache[key].toJSON();
    }

    return payload;
  }

  public static instance(): SimulationCache {
    if (!SimulationCache._instance) {
      SimulationCache._instance = new SimulationCache();
    }
    return SimulationCache._instance;
  }

  public addSimulation(key: string, sim: Simulation) {
    if (this.exists(key)) {
      throw new Error(`Simulation with key '${key}' already exists.`);
    }
    this.cache[key] = sim;
  }

  public at(key: string): Simulation {
    if (!this.exists(key)) {
      throw new Error(`Simulation with key '${key}' does not exist.`);
    }

    return this.cache[key];
  }

  public exists(key: string): boolean {
    return !!this.cache[key];
  }
}

function addSimulationToCache(key: string, sim: Simulation): void {
  SimulationCache.instance().addSimulation(key, sim);
}

export function useSimCache(): [SimulationCache, typeof addSimulationToCache] {
  return [SimulationCache.instance(), addSimulationToCache];
}
