export interface SimulationFrame {
  // If we multithread, we want to make sure the frames are in order.
  frameno: number;

  // 2D vertex coordinates.
  vertices: number[];

  // We only send indices on frame 0 since we don't support mesh destruction.
  indices?: number[];
}

export interface SimulationPayload {
  frames: SimulationFrame[];
}
