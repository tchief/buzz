export const join = <T>(a: T[], c = " ") =>
  a.flatMap((ai, i) => i > 0 ? [c, ai] : [ai]);

export const shuffle = <T>(a: T[]) => a.sort(() => Math.random() - 0.5);

export const chunk = <T>(a: T[], chunks: number) =>
  [...Array(Math.ceil(a.length / chunks))].map((_) => a.splice(0, chunks));
