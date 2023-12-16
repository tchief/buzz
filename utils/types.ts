export type CellType = "numbers" | "letters" | "words";

export interface Game<T = string | number> {
  field: T[][];
  mask: string;
  max: T;
  status: boolean;
  gif?: string;
  size: number;
  type: CellType;
  alphabet?: string[];
  path: string;
}
export interface Room {
  id: number;
  slug: string;
  key: string;
  phrase: string;
  alphabet?: string;
  size?: number;
  type?: CellType;
  mask?: string;
  user_id?: string;
}
