import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export default class CreateSimulation {
  @Expose()
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  public mesh!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  public material!: "snh" | "stvk";

  @Expose()
  @IsString()
  @IsNotEmpty()
  public integrator!: "forward-euler-area";
}
