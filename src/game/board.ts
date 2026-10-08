// Канон правил: Хариш Джохари, «Лила. Игра самопознания» (рус. изд. «София», 1999), глава 1.
// Доска 9 колонок × 8 рядов, нумерация «змейкой» снизу вверх: ряд 1 — 1..9 слева направо,
// ряд 2 — 10..18 справа налево и т.д.

export const COLS = 9;
export const ROWS = 8;
export const CELLS_COUNT = 72;
export const START_CELL = 68; // «Космическое Сознание» — здесь ждут все фишки
export const GOAL_CELL = 68;  // победа: попасть точно сюда
export const BIRTH_CELL = 1;  // «Рождение»: вход в игру только по 6 → 1 → 6 шагов → 6

export const ARROWS: Readonly<Record<number, number>> = {
  10: 23, 17: 69, 20: 32, 22: 60, 27: 41,
  28: 50, 37: 66, 45: 67, 46: 62, 54: 68,
};

export const SNAKES: Readonly<Record<number, number>> = {
  12: 8, 16: 4, 24: 7, 29: 6, 44: 9,
  52: 35, 55: 3, 61: 13, 63: 2, 72: 51,
};

export const TRANSITIONS: Readonly<Record<number, number>> = { ...ARROWS, ...SNAKES };

export type TransitionKind = 'arrow' | 'snake';

export function transitionKind(n: number): TransitionKind | undefined {
  if (n in ARROWS) return 'arrow';
  if (n in SNAKES) return 'snake';
  return undefined;
}

/** Центр клетки в долях от области доски (0..1), ряд 1 внизу. Для наложения координат на арт. */
export function cellCenter(n: number): { x: number; y: number } {
  const row = Math.floor((n - 1) / COLS);
  const i = (n - 1) % COLS;
  const col = row % 2 === 0 ? i : COLS - 1 - i;
  return { x: (col + 0.5) / COLS, y: 1 - (row + 0.5) / ROWS };
}

/** Разрешающая клетка после остановки на n (змеи/стрелы срабатывают автоматически). */
export function applyTransition(n: number): number {
  return TRANSITIONS[n] ?? n;
}
