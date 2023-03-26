<script setup lang="ts">
import { GameNamespaceSocket } from '@/types/socket';
import Game from '@/modules/Game';
import { CellPosition } from '@/types/game';
import Alert, { fireResultAlert } from '@/modules/Alert';

const { room, myTurn, playerNames } = useOnlineGameStore();

const game = new Game();

const board = ref([...game.board]);
const turn = ref(game.turn);
const puttableCells = ref(game.findPuttableCells());
const gameStats = ref(game.measureGameStats());

let gameSocket: GameNamespaceSocket | undefined;

// 自分の手番でかつmoveがputtableCellsに含まれていればmoveをソケットサーバーに送信する
const emitMove = (move: CellPosition) => {
  if (
    game.turn === myTurn.value &&
    puttableCells.value.some(cell => move.x === cell.x && move.y === cell.y)
  ) {
    gameSocket?.emit('move', move);
  }
};

onMounted(async () => {
  // '@/modules/socket'モジュールはwindow.locationを使用しているのでonMountedフックで初期化する
  gameSocket = (await import('@/modules/socket')).gameSocket;
  gameSocket.connect().emit('enter', room.value);

  gameSocket.on('move', async (move: CellPosition) => {
    game.putStone(move.x, move.y);
    const skippedTurns = game.changeTurn();

    // 値を更新しても参照が同じだとTheOthelloBoardのウォッチャーが起動しないのでboardにはコピーを渡す
    board.value = [...game.board];
    turn.value = game.turn;
    puttableCells.value = game.findPuttableCells();
    gameStats.value = game.measureGameStats();

    if (skippedTurns.length >= 1 && skippedTurns.length < 3) {
      // パスした人がいるが全員がパスしたわけではない場合
      let skippedPlayerNames = '';
      for (const skippedTurn of skippedTurns) {
        skippedPlayerNames += toPlayerName(skippedTurn, playerNames.value) + ' ';
      }
      Alert.fire({
        title: 'パス',
        text: `${skippedPlayerNames} は石を置けるマスがありません。`,
        icon: 'info',
        timer: 1500,
      });
    } else if (skippedTurns.length === 3) {
      // 全員がパスした場合（これはゲームの終了を意味する）
      gameSocket?.disconnect();
      const { isConfirmed } = await fireResultAlert(playerNames.value, gameStats.value);
      if (isConfirmed) {
        await navigateTo('/');
      }
    }
  });
});

onBeforeUnmount(() => {
  gameSocket?.removeAllListeners().disconnect();
});
</script>

<template>
  <div class="d-flex flex-column justify-space-evenly align-center h-100">
    <TheScorePanel
      :player-names="playerNames"
      :scores="gameStats.scores"
      :turn="turn"
    />
    <TheOthelloBoard
      :board="board"
      :puttable-cells="puttableCells"
      @decide-move="emitMove"
    />
  </div>
</template>
