import { CellType, Room } from "./types.ts";

export const DEFAULT_SIZE = 3;
export const DEFAULT_MASK = "_";
export const DEFAULT_TYPE = "numbers";
export const ALPHABET_NUMBERS_1_9 = "123456789";
export const ALPHABET_LETTERS_A_Z = "abcdefghijklmnopqrstuvwxyz";
export const roomToGame = (room: Room | null) => {
  const size = room?.size ?? DEFAULT_SIZE;
  const max = size * size;
  const mask = room?.mask ?? DEFAULT_MASK;
  const type = room?.type ?? DEFAULT_TYPE;
  const key = room?.key ?? create(size);
  const alphabet = room?.alphabet?.split(",")?.sort() ?? getAlphabet(size);
  const game = generate(key, size, max, mask, type, alphabet);
  return game;
};

export const join = <T>(a: T[], c = " ") => a.flatMap((ai, i) => i > 0 ? [c, ai] : [ai]);

export const shuffle = <T>(a: T[]) => a.sort(() => Math.random() - 0.5);

export const create = (side = 3) =>
  shuffle([...Array(side * side).keys().map((i: number) => i + 1)]).join();

export const getAlphabet = (side = 3) =>
  [...Array(side * side).keys().map((i: number) => i + 1)].sort();

export const chunk = <T>(a: T[], chunks: number) =>
  [...Array(Math.ceil(a.length / chunks))].map((_) => a.splice(0, chunks));

export const fill = <T>(items: T[][], masked?: string) => {
  const pairs = [];
  const compare = <T>(a: T, b: T) => a < b ? "<" : a > b ? ">" : "=";
  const mask = (a: T) => masked ?? a;
  for (let i = 0; i < items.length; i++) {
    const row = [], rowV = [];
    row.push(mask(items[i][0]));
    if (i > 0) rowV.push(compare(items[i - 1][0], items[i][0]), "");

    for (let j = 1; j < items[i].length; j++) {
      const condition = compare(items[i][j - 1], items[i][j]);
      row.push(condition, mask(items[i][j]));

      if (i > 0) rowV.push(compare(items[i - 1][j], items[i][j]), "");
    }

    if (i > 0) pairs.push(rowV);
    pairs.push(row);
  }

  return pairs;
};

export const generate = (
  key: string,
  size: number,
  max: string | number,
  mask: string,
  type: CellType = "numbers",
  alphabet?: string[],
) => {
  const a = key.split(",").map((x) => type === "numbers" ? parseInt(x) : x);
  const length = size; //Math.sqrt(a.length);
  const field = fill(chunk(a, length), mask);
  const game = { field, size, mask, max, status: false, type, alphabet, path: "" };
  return game;
};

export const sizeToGame = (initialSize?: string) => {
  const size = +(initialSize ?? 3);
  const max = size * size;
  const mask = "_";
  const type = "numbers";
  const key = create(size);
  const alphabet = getAlphabet(size);
  const game = generate(key, size, max, mask, type, alphabet);
  return game;
};

export const isNotACell = (i: number, j: number) => i % 2 != 0 || j % 2 != 0;

export const next = (
  n: string | number,
  max: string | number,
  alphabet?: string[],
) => {
  if (!alphabet || alphabet.length === 0 || alphabet.join("") === ALPHABET_NUMBERS_1_9) {
    return Number.isNaN(+n) ? 1 : +n === +max ? 1 : +n + 1;
  } else {
    const i = alphabet.indexOf(n.toString());
    return i === -1 ? alphabet[0] : i === alphabet.length - 1 ? alphabet[0] : alphabet[i + 1];
  }
};

export const prev = (
  n: string | number,
  max: string | number,
  alphabet?: string[],
) => {
  if (!alphabet || alphabet.length === 0 || alphabet.join("") === ALPHABET_NUMBERS_1_9) {
    return Number.isNaN(+n) ? +max : +n === 1 ? +max : +n - 1;
  } else {
    const i = alphabet.indexOf(n.toString());
    return i === -1 ? alphabet[0] : i === 0 ? alphabet[alphabet.length - 1] : alphabet[i - 1];
  }
};

export const check = <T extends string | number>(items: T[][], mask = "_") => {
  const all = items.flatMap((s) => s);
  const playing = all.find((i) => i === mask);
  if (playing) return false;

  const numbers = all.filter((i) => !["<", ">", " ", ""].includes(i.toString()));
  const repeating = (new Set(numbers)).size !== numbers.length;
  if (repeating) return false;

  const condition = (a: T, b: T, c: T) =>
    b === "<" ? a < c : b === ">" ? a > c : b === "=" ? a === c : false;

  for (let i = 0; i < items.length; i += 2) {
    for (let j = 1; j < items[i].length - 1; j += 2) {
      if (!condition(items[i][j - 1], items[i][j], items[i][j + 1])) return false;
    }
  }

  for (let i = 1; i < items.length - 1; i += 2) {
    for (let j = 0; j < items[i].length; j += 2) {
      if (!condition(items[i - 1][j], items[i][j], items[i + 1][j])) return false;
    }
  }

  return true;
};
