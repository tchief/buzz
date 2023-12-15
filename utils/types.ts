export type CellType = "numbers" | "letters" | "words";
export interface Game<T = string | number> {
  field: T[][];
  mask: string;
  max: T;
  status: boolean;
  size: number;
  type: CellType;
  alphabet?: string[];
  path: string;
}
