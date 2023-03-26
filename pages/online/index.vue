<script setup lang="ts">
import { EntryNamespaceSocket } from '@/types/socket';
import Alert from '@/modules/Alert';

const gameInfo = useOnlineGameStore();
const entered = ref(false);

let entrySocket: EntryNamespaceSocket | undefined;

const enterRoom = (room: string, playerName: string): void => {
  entrySocket?.connect().emit('enter', room, playerName);
  gameInfo.room.value = room;
  entered.value = true;
};

const leaveRoom = (): void => {
  entrySocket?.disconnect();
  entered.value = false;
};

onMounted(async () => {
  // '@/modules/socket'モジュールはwindow.locationを使用しているのでonMountedフックで初期化する
  entrySocket = (await import('@/modules/socket')).entrySocket;

  entrySocket.on('ready', async (myTurn, playerNames) => {
    gameInfo.myTurn.value = myTurn;
    gameInfo.playerNames.value = playerNames;
    await navigateTo('/online/game');
  });

  entrySocket.on('existentRoom', () => {
    Alert.fire({
      text: `ルーム名 ${gameInfo.room.value} は他のグループに使用されています。`,
      icon: 'error',
    });
    entered.value = false;
  });
});

onBeforeUnmount(() => {
  entrySocket?.removeAllListeners().disconnect();
});
</script>

<template>
  <div class="d-flex justify-center align-center h-100">
    <TheEntryForm
      v-if="!entered"
      @enter="enterRoom"
    />
    <TheStandbyPanel
      v-else
      @leave="leaveRoom"
    />
  </div>
</template>
