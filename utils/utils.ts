export const join = <T>(a: T[], c = " ") => a.flatMap((ai, i) => i > 0 ? [c, ai] : [ai]);

export const shuffle = <T>(a: T[]) => a.sort(() => Math.random() - 0.5);

export const chunk = <T>(a: T[], chunks: number) =>
  [...Array(Math.ceil(a.length / chunks))].map((_) => a.splice(0, chunks));

export const fill = <T>(items: T[][], masked?: string) => {
  const pairs = [];
  const compare = <T>(a: T, b: T) => a < b ? "<" : a > b ? ">" : "=";
  const mask = (a: T) => masked ?? a;
  console.log({ items });
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

export const generate = (key: string, size: number, max: string | number, mask: string) => {
  const a = key.split(",").map((x) => parseInt(x));
  const length = Math.sqrt(a.length);
  const field = fill(chunk(a, length), mask);
  const game = { field, size, mask, max, status: false };
  return game;
};

export const check = <T extends string | number>(items: T[][], mask = "__") => {
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
