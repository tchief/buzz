export type CellType = "numbers" | "letters";
export interface Game<T = string | number> {
  field: T[][];
  mask: string;
  max: T;
  status: boolean;
  size: number;
  type: CellType;
  alphabet?: string[];
}
