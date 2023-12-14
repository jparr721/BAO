import { Expose, Type } from "class-transformer";
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import materials from "../../material/materials";
import { ALL_MESHES } from "../../geometry/read-mesh-store";

export default class CreateSimulation {
  // The front-end identifier for the simulation.
  @Expose()
  @IsNotEmpty()
  @IsString()
  public simulationName!: string;

  // The name of the mesh from the folder.
  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsIn(ALL_MESHES)
  public meshName!: string;

  // The type of energy function to use.
  @Expose()
  @IsNotEmpty()
  @IsIn(materials)
  public energyType!: "snh" | "stvk";

  // The timestep to use.
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  public dt!: number;

  // Young's modulus for hyperelastic materials.
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  public youngsModulus!: number;

  // Poisson's ratio for hyperelastic materials.
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  public poissonsRatio!: number;

  // The uniform nodal mass of the material.
  @IsOptional()
  @Expose()
  @IsNumber()
  public materialMass?: number;

  // The collision envelope size (how close two vertices need to be to trigger a collision).
  @IsOptional()
  @Expose()
  @IsNumber()
  public collisionEps?: number;

  // Rayleigh damping parameters
  @IsOptional()
  @Expose()
  @IsNumber()
  public rayleighAlpha?: number;

  @IsOptional()
  @Expose()
  @IsNumber()
  public rayleighBeta?: number;

  // The gravity vector.
  @IsOptional()
  @Expose()
  @IsNumber({}, { each: true })
  public gravity?: number[];
}
