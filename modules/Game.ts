import { BoardSize, Turn, CellState } from '@/constants/game';
import { CellPosition, Board } from '@/types/game';

export default class Game {
  readonly board: Board;
  turn: Turn = Turn.PLAYER_1;

  constructor() {
    /*
      盤面を初期化する
      左下と右上を切り落とした2次元配列で六角形の盤を表現する
      石を挟んでいるかの判定処理の簡略化のため配列のサイズを盤のサイズより2大きくして盤の外側をOUTSIDEで囲む
    */
    this.board = [];

    // まず全てのマスをEMPTYかOUTSIDEで埋める
    for (let y = 0; y < BoardSize.DIAGONAL_LENGTH + 2; y++) {
      this.board.push([]);
      for (let x = 0; x < BoardSize.DIAGONAL_LENGTH + 2; x++) {
        if (
          y >= 1 &&
          y < BoardSize.DIAGONAL_LENGTH + 1 &&
          x >= Math.max(y - BoardSize.SIDE_LENGTH, 0) + 1 &&
          x < Math.min(y + BoardSize.SIDE_LENGTH, BoardSize.DIAGONAL_LENGTH + 1) &&
          !(x === BoardSize.SIDE_LENGTH && y === BoardSize.SIDE_LENGTH)
        ) {
          // 盤の内部の場合(中央のマスはルールにより盤の外部)
          this.board[y].push(CellState.EMPTY);
        } else {
          // 盤の外部の場合
          this.board[y].push(CellState.OUTSIDE);
        }
      }
    }

    // 各プレイヤーの初期の石を配置する
    for (
      const cell of [
        { x: BoardSize.SIDE_LENGTH - 1, y: BoardSize.SIDE_LENGTH },
        { x: BoardSize.SIDE_LENGTH, y: BoardSize.SIDE_LENGTH - 2 },
        { x: BoardSize.SIDE_LENGTH, y: BoardSize.SIDE_LENGTH + 2 },
        { x: BoardSize.SIDE_LENGTH + 1, y: BoardSize.SIDE_LENGTH },
      ]
    ) {
      this.board[cell.y][cell.x] = CellState.PLAYER_1;
    }
    for (
      const cell of [
        { x: BoardSize.SIDE_LENGTH - 2, y: BoardSize.SIDE_LENGTH },
        { x: BoardSize.SIDE_LENGTH - 1, y: BoardSize.SIDE_LENGTH - 1 },
        { x: BoardSize.SIDE_LENGTH + 1, y: BoardSize.SIDE_LENGTH + 1 },
        { x: BoardSize.SIDE_LENGTH + 2, y: BoardSize.SIDE_LENGTH },
      ]
    ) {
      this.board[cell.y][cell.x] = CellState.PLAYER_2;
    }
    for (
      const cell of [
        { x: BoardSize.SIDE_LENGTH - 2, y: BoardSize.SIDE_LENGTH - 2 },
        { x: BoardSize.SIDE_LENGTH, y: BoardSize.SIDE_LENGTH - 1 },
        { x: BoardSize.SIDE_LENGTH, y: BoardSize.SIDE_LENGTH + 1 },
        { x: BoardSize.SIDE_LENGTH + 2, y: BoardSize.SIDE_LENGTH + 2 },
      ]
    ) {
      this.board[cell.y][cell.x] = CellState.PLAYER_3;
    }
  }

  findReversibleStones(x: number, y: number): CellPosition[] {
    const reversibleStones: CellPosition[] = [];
    const directions = [
      { x: -1, y: -1 },
      { x: -1, y: 0 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ] as const;

    // 対象のマスがEMPTYでなければ石を置けず裏返せるマスもない
    if (this.board[y][x] !== CellState.EMPTY) {
      return reversibleStones;
    }

    for (const direction of directions) {
      let distance = 1;
      let searchX = x + distance * direction.x;
      let searchY = y + distance * direction.y;

      // 隣のマスに自分以外のプレイヤーの石が置かれていなければその方向には石を裏返せない
      if (
        this.board[searchY][searchX] === this.turn ||
        this.board[searchY][searchX] === CellState.EMPTY ||
        this.board[searchY][searchX] === CellState.OUTSIDE
      ) {
        continue;
      }

      while (true) {
        distance++;
        searchX = x + distance * direction.x;
        searchY = y + distance * direction.y;

        if (this.board[searchY][searchX] === this.turn) {
          for (let d = 1; d < distance; d++) {
            let reverseX = x + d * direction.x;
            let reverseY = y + d * direction.y;
            reversibleStones.push({ x: reverseX, y: reverseY });
          }
          break;
        }

        if (
            this.board[searchY][searchX] === CellState.EMPTY ||
            this.board[searchY][searchX] === CellState.OUTSIDE
        ) {
          break;
        }
      }
    }

    return reversibleStones;
  }

  findPuttableCells(): CellPosition[] {
    const puttableCells: CellPosition[] = [];

    // 盤の内部の全てのマスについてループする
    for (let y = 1; y < BoardSize.DIAGONAL_LENGTH + 1; y++) {
      for (
        let x = Math.max(y - BoardSize.SIDE_LENGTH, 0) + 1;
        x < Math.min(y + BoardSize.SIDE_LENGTH, BoardSize.DIAGONAL_LENGTH + 1);
        x++
      ) {
        // 裏返せる石があればそのマスに石を置ける
        if (this.findReversibleStones(x, y).length > 0) {
          puttableCells.push({ x, y });
        }
      }
    }

    return puttableCells;
  }

  putStone(x: number, y: number): void {
    // 石を置くマスがEMPTYでないとreversibleStonesを取得できないので石を置く前に取得しておく
    const reversibleStones = this.findReversibleStones(x, y);

    this.board[y][x] = this.turn;
    for (const stone of reversibleStones) {
      this.board[stone.y][stone.x] = this.turn;
    }
  }

  // 石を置けるマスがある次のプレイヤーまで手番を進め飛ばされた手番の一覧を返す
  changeTurn(): Turn[] {
    const skippedTurns: Turn[] = [];

    while (true) {
      // 手番を1つ進める
      if (this.turn === Turn.PLAYER_1) {
        this.turn = Turn.PLAYER_2;
      } else if (this.turn === Turn.PLAYER_2) {
        this.turn = Turn.PLAYER_3;
      } else {
        this.turn = Turn.PLAYER_1;
      }

      // 石を置けるマスがあればそれ以上手番を変更する必要はない
      if (this.findPuttableCells().length > 0) {
        return skippedTurns;
      }

      skippedTurns.push(this.turn);

      // 誰も石を置けるマスがなければゲーム終了なので手番の変更を終了する
      if (skippedTurns.length === 3) {
        return skippedTurns;
      }
    }
  }

  measureGameStats(): {
    firstPlace: Turn[];
    scores: { player1: number; player2: number; player3: number };
  } {
    // scoresを計算する
    const scores = { player1: 0, player2: 0, player3: 0 };

    // 盤の内部の全てのマスについてループする
    for (let y = 1; y < BoardSize.DIAGONAL_LENGTH + 1; y++) {
      for (
        let x = Math.max(y - BoardSize.SIDE_LENGTH, 0) + 1;
        x < Math.min(y + BoardSize.SIDE_LENGTH, BoardSize.DIAGONAL_LENGTH + 1);
        x++
      ) {
        if (this.board[y][x] === CellState.PLAYER_1) {
          scores.player1++;
        } else if (this.board[y][x] === CellState.PLAYER_2) {
          scores.player2++;
        } else if (this.board[y][x] === CellState.PLAYER_3) {
          scores.player3++;
        }
      }
    }

    // firstPlaceを計算する
    // 同点で1位が2人以上いる場合があるのでfirstPlaceを配列で表す
    const firstPlace: Turn[] = [];
    const maxScore = Math.max(...Object.values(scores));

    if (scores.player1 === maxScore) {
      firstPlace.push(Turn.PLAYER_1);
    }
    if (scores.player2 === maxScore) {
      firstPlace.push(Turn.PLAYER_2);
    }
    if (scores.player3 === maxScore) {
      firstPlace.push(Turn.PLAYER_3);
    }

    return { firstPlace, scores };
  }
}
