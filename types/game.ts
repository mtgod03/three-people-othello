import type { CellState } from '@/constants/game';

export type CellPosition = {
  x: number;
  y: number;
};

export type Board = CellState[][];
