// Темп анимаций M1. Подобран по симуляции 50 000 партий:
// медиана 33 хода, среднее 42.4, p10 12, p90 86; ~10.9 змей/стрел и ~7.9 перелётов за 72 на партию.
// Цель: чистое время анимаций ≈ 1 мин на медианную партию, ≤ 3 мин на p90.

export const PACE = {
  diceRoll: 700,        // вращение кубика
  diceSettle: 150,      // пауза, чтобы увидеть выпавшее число
  stepPerCell: 160,     // шаг фишки на одну клетку
  stepMaxTotal: 1100,   // потолок на весь путь: серия шестёрок ускоряет шаг, а не тянет ход
  landPause: 200,       // фишка встала на клетку
  snake: 1300,          // спуск по змее (72→51 — главный «драматичный» момент)
  arrow: 1100,          // подъём по стреле
  overshoot: 450,       // перелёт за 72: короткое покачивание, фишка стоит на месте
  tripleSixReset: 900,  // три шестёрки — возврат
} as const;

export type MoveKind = 'normal' | 'snake' | 'arrow' | 'overshoot' | 'reset';

/** Множитель скорости: 1 — обычно, 2 — «быстрый режим», reduced-motion — почти мгновенно. */
export function speedFactor(fast = false): number {
  const reduced =
    typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return 4;
  return fast ? 2 : 1;
}

/** Длительность шага на одну клетку с учётом потолка на весь путь. */
export function stepDuration(cells: number, speed = 1): number {
  if (cells <= 0) return 0;
  return Math.min(PACE.stepPerCell, PACE.stepMaxTotal / cells) / speed;
}

/** Полная длительность хода в мс (для очереди анимаций и блокировки кнопки броска). */
export function moveDuration(kind: MoveKind, cells: number, speed = 1): number {
  const dice = (PACE.diceRoll + PACE.diceSettle) / speed;
  if (kind === 'overshoot') return dice + PACE.overshoot / speed;
  if (kind === 'reset') return dice + PACE.tripleSixReset / speed;
  const walk = stepDuration(cells, speed) * cells + PACE.landPause / speed;
  const extra = kind === 'snake' ? PACE.snake : kind === 'arrow' ? PACE.arrow : 0;
  return dice + walk + extra / speed;
}
