function checkLengths(target: any, propertyName: string, descriptor: any) {
  const originalMethod = descriptor.value;
  descriptor.value = function (other: Vector) {
    if (this._values.length !== other.values.length) {
      throw new Error(
        `Vector lengths do not match: ${this._values.length} and ${other.values.length}`
      );
    }
    return originalMethod.apply(this, [other]);
  };
}

export class Vector {
  private _values: number[];

  constructor(...values: number[]) {
    this._values = values;
  }

  public static zero(size: number): Vector {
    return new Vector(...Array(size).fill(0));
  }

  public static one(size: number): Vector {
    return new Vector(...Array(size).fill(1));
  }

  public static fromArray(array: number[]): Vector {
    return new Vector(...array);
  }

  get values(): number[] {
    return this._values;
  }

  get x(): number {
    return this._values[0];
  }

  set x(value: number) {
    this._values[0] = value;
  }

  get y(): number {
    return this._values[1];
  }

  set y(value: number) {
    this._values[1] = value;
  }

  get z(): number | undefined {
    return this._values.length > 2 ? this._values[2] : undefined;
  }

  set z(value: number | undefined) {
    if (this._values.length > 2 && value !== undefined) {
      this._values[2] = value;
    }
  }

  get w(): number | undefined {
    return this._values.length > 3 ? this._values[3] : undefined;
  }

  set w(value: number | undefined) {
    if (this._values.length > 3 && value !== undefined) {
      this._values[3] = value;
    }
  }

  get length(): number {
    return this._values.length;
  }

  get shape(): number[] {
    return [this._values.length, 1];
  }

  get rows(): number {
    return this._values.length;
  }

  @checkLengths
  public add(other: Vector): Vector {
    const newValues = this._values.map((v, i) => v + other._values[i]);
    return new Vector(...newValues);
  }

  @checkLengths
  public addInPlace(other: Vector): void {
    this._values = this._values.map((v, i) => v + other._values[i]);
  }

  @checkLengths
  public sub(other: Vector): Vector {
    const newValues = this._values.map((v, i) => v - other._values[i]);
    return new Vector(...newValues);
  }

  @checkLengths
  public subInPlace(other: Vector): void {
    this._values = this._values.map((v, i) => v - other._values[i]);
  }

  public mul(other: number): Vector {
    const newValues = this._values.map((v) => v * other);
    return new Vector(...newValues);
  }

  public mulInPlace(other: number): void {
    this._values = this._values.map((v) => v * other);
  }

  public div(other: number): Vector {
    const newValues = this._values.map((v) => v / other);
    return new Vector(...newValues);
  }

  public divInPlace(other: number): void {
    this._values = this._values.map((v) => v / other);
  }

  @checkLengths
  public dot(other: Vector): number {
    return this._values.reduce((acc, v, i) => acc + v * other._values[i], 0);
  }

  @checkLengths
  public cross(other: Vector): Vector {
    if (other.length !== 3 && this.length !== 3) {
      throw new Error("Cross product only defined for 3D vectors");
    }

    const [x1, y1, z1] = this._values;
    const [x2, y2, z2] = other._values;

    return new Vector(y1 * z2 - z1 * y2, z1 * x2 - x1 * z2, x1 * y2 - y1 * x2);
  }

  public norm(): number {
    return Math.sqrt(this.dot(this));
  }

  public normalized(): Vector {
    return this.div(this.norm());
  }

  public normalize(): void {
    this.divInPlace(this.norm());
  }

  public clone(): Vector {
    return new Vector(...Array.from(this._values));
  }

  @checkLengths
  public equals(other: Vector): boolean {
    return this._values.every((v, i) => v === other._values[i]);
  }

  public set(index: number, value: number): void;
  public set(index: number[], value: number[]): void;
  public set(index: number | number[], value: number | number[]): void {
    if (typeof index === "number") {
      if (Array.isArray(value)) {
        throw new Error("Cannot assign more than one value to a single index.");
      }

      this._values[index] = value;
    } else if (Array.isArray(index)) {
      if (!Array.isArray(value)) {
        throw new Error("Cannot assign single value to more than one index");
      }

      if (index.length !== value.length) {
        throw new Error(
          `Index and value lengths do not match: ${index.length} and ${value.length}`
        );
      }

      for (const i of index) {
        this._values[i] = value[i];
      }
    } else {
      throw new Error(`Invalid index type ${typeof index}`);
    }
  }

  public get(index: number): number;
  public get(index: number[]): number[];
  public get(index: number | number[]): number | number[] {
    if (typeof index === "number") {
      return this._values[index];
    } else if (Array.isArray(index)) {
      return index.map((i) => this._values[i]);
    }

    throw new Error(`Invalid index type ${typeof index}`);
  }
}
