export const BoardSize = {
  SIDE_LENGTH: 5,
  DIAGONAL_LENGTH: 9,
} as const;

export const Turn = {
  PLAYER_1: 0,
  PLAYER_2: 1,
  PLAYER_3: 2,
} as const;
export type Turn = typeof Turn[keyof typeof Turn];

export const CellState = {
  ...Turn,
  EMPTY: 3,
  OUTSIDE: 4,
} as const;
export type CellState = typeof CellState[keyof typeof CellState];
