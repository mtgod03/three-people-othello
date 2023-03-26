import { BoardSize, CellState } from '@/constants/game';
import { CellPosition, Board } from '@/types/game';

/*
  [各要素の長さの比]
  マスの横幅 = 2
  マスの高さ = √3
  (マスが正六角形なのでこの比率になる)

  マスの中心間の横幅 = 0.75 * マスの横幅 (= 1.5)
  マスの中心間の高さ = マスの高さ (= √3)
  (マスが正六角形なので横方向には本来のマスの幅よりも詰めて並べられる)

  キャンバスの横幅 = マスの中心間の横幅 * (対角線上のマスの数 + 1)
  キャンバスの高さ = マスの中心間の高さ * (対角線上のマスの数 + 1)
  (キャンバスのサイズは1.5:√3になる)

  [描画の手順]
  まず、キャンバスを縦横にそれぞれマスが(対角線上のマスの数 + 1)個ずつ入るサイズ(1.5:√3)にする
  その後、両端を0.5マス分ずつ空けてマスを敷き詰める
*/

export default class Renderer {
  // マウントされるまでcanvas要素への参照を得られないのでコンストラクタではcanvasをセットしない
  private canvas: HTMLCanvasElement | undefined;
  private ctx: CanvasRenderingContext2D | undefined;

  // 最初の段階ではcanvasがセットされていないのでサイズ系のプロパティはひとまず0にする
  private cellWidth = 0;
  private cellHeight = 0;
  private centerToCenterWidth = 0;
  private centerToCenterHeight = 0;
  private stoneRadius = 0;

  setCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;
  }

  toCellPosition(canvasX: number, canvasY: number): CellPosition {
    // 縦の位置は横の位置が中心から離れるにつれてずれる
    const tmpX = canvasX / this.centerToCenterWidth;
    const tmpY = canvasY / this.centerToCenterHeight +
                 0.5 * Math.round(tmpX - BoardSize.SIDE_LENGTH);

    let cellX = Math.round(tmpX);
    let cellY = Math.round(tmpY);

    // マスの端の部分の座標を受け取った場合の処理
    if (tmpY - Math.round(tmpY) < -1.5 * (tmpX - Math.round(tmpX)) - 1) {
      cellX -= 1;
      cellY -= 1;
    } else if (tmpY - Math.round(tmpY) > 1.5 * (tmpX - Math.round(tmpX)) + 1) {
      cellX -= 1;
    } else if (tmpY - Math.round(tmpY) < 1.5 * (tmpX - Math.round(tmpX)) - 1) {
      cellX += 1;
    } else if (tmpY - Math.round(tmpY) > -1.5 * (tmpX - Math.round(tmpX)) + 1) {
      cellX += 1;
      cellY += 1;
    }

    // 盤の外部や中央のマス(ルールにより中央のマスも盤の外部)の座標を受け取った場合の処理
    if (
      cellY === 0 ||
      cellY === BoardSize.DIAGONAL_LENGTH + 1 ||
      cellX < Math.max(cellY - BoardSize.SIDE_LENGTH, 0) + 1 ||
      cellX >= Math.min(cellY + BoardSize.SIDE_LENGTH, BoardSize.DIAGONAL_LENGTH + 1) ||
      (cellX === BoardSize.SIDE_LENGTH && cellY === BoardSize.SIDE_LENGTH)
    ) {
      throw new Error('The coordinate is outside the board.');
    }

    return { x: cellX, y: cellY };
  }

  update(board: Board, puttableCells: CellPosition[]): void {
    if (typeof this.canvas === 'undefined' || typeof this.ctx === 'undefined') {
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 全てのマスについてループする
    for (let y = 1; y < BoardSize.DIAGONAL_LENGTH + 1; y++) {
      for (
        let x = Math.max(y - BoardSize.SIDE_LENGTH, 0) + 1;
        x < Math.min(y + BoardSize.SIDE_LENGTH, BoardSize.DIAGONAL_LENGTH + 1);
        x++
      ) {
        // マスを描画する
        if (puttableCells.some(move => x === move.x && y === move.y)) {
          // puttableCellsに含まれるマスの場合
          this.drawCell(x, y, '#ffff80');
        } else if (x === BoardSize.SIDE_LENGTH && y === BoardSize.SIDE_LENGTH) {
          // 中央のマスの場合(ルールにより中央のマスは盤の外部)
          this.drawCell(x, y, '#000000');
        } else {
          // その他のマスの場合
          this.drawCell(x, y, '#ffffff');
        }

        // 石を描画する
        if (board[y][x] === CellState.PLAYER_1) {
          this.drawStone(x, y, '#ff0000');
        } else if (board[y][x] === CellState.PLAYER_2) {
          this.drawStone(x, y, '#008000');
        } else if (board[y][x] === CellState.PLAYER_3) {
          this.drawStone(x, y, '#0000ff');
        }
      }
    }
  }

  resize(): void {
    if (typeof this.canvas === 'undefined') {
      return;
    }

    // 横幅が親要素に収まり高さがウィンドウの25%以上残るようにしつつ画面比を1.5:√3にする
    const maxWidth = this.canvas.parentElement!.clientWidth;
    const maxHeight = 0.75 * window.innerHeight;
    const aspectRatio = 1.5 / Math.sqrt(3);
    this.canvas.width = Math.min(maxWidth, aspectRatio * maxHeight);
    this.canvas.height = this.canvas.width / aspectRatio;

    // 画面の大きさに応じてサイズ系のプロパティを計算し直す
    this.centerToCenterWidth = this.canvas.width / (BoardSize.DIAGONAL_LENGTH + 1);
    this.centerToCenterHeight = this.canvas.height / (BoardSize.DIAGONAL_LENGTH + 1);
    this.cellWidth = 4 / 3 * this.centerToCenterWidth;
    this.cellHeight = this.centerToCenterHeight;
    this.stoneRadius = 5 / 16 * this.cellHeight;
  }

  // 入力されたマスの中心の座標を返す
  private toCanvasCoordinate(cellX: number, cellY: number): { canvasX: number; canvasY: number } {
    // 縦の位置は横の位置が中心から離れるにつれてずれる
    return {
      canvasX: this.centerToCenterWidth * cellX,
      canvasY: this.centerToCenterHeight * (cellY - 0.5 * (cellX - BoardSize.SIDE_LENGTH))
    };
  }

  private drawCell(cellX: number, cellY: number, color: string): void {
    if (typeof this.ctx === 'undefined') {
      return;
    }

    const { canvasX, canvasY } = this.toCanvasCoordinate(cellX, cellY);
    this.ctx.beginPath();
    this.ctx.moveTo(canvasX + 0.25 * this.cellWidth, canvasY - 0.5 * this.cellHeight);
    this.ctx.lineTo(canvasX + 0.5 * this.cellWidth, canvasY);
    this.ctx.lineTo(canvasX + 0.25 * this.cellWidth, canvasY + 0.5 * this.cellHeight);
    this.ctx.lineTo(canvasX - 0.25 * this.cellWidth, canvasY + 0.5 * this.cellHeight);
    this.ctx.lineTo(canvasX - 0.5 * this.cellWidth, canvasY);
    this.ctx.lineTo(canvasX - 0.25 * this.cellWidth, canvasY - 0.5 * this.cellHeight);
    this.ctx.closePath();
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  private drawStone(cellX: number, cellY: number, color: string) {
    if (typeof this.ctx === 'undefined') {
      return;
    }

    const { canvasX, canvasY } = this.toCanvasCoordinate(cellX, cellY);
    this.ctx.beginPath();
    this.ctx.arc(canvasX, canvasY, this.stoneRadius, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }
}
