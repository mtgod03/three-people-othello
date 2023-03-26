<script setup lang="ts">
import Renderer from '@/modules/Renderer';
import { CellPosition, Board } from '@/types/game';

const props = defineProps<{
  board: Board;
  puttableCells: CellPosition[];
}>();

const emits = defineEmits<{
  (e: 'decideMove', move: CellPosition): void;
}>();

const canvas = ref<HTMLCanvasElement | null>(null);
const renderer = new Renderer();

const decideMove = (event: MouseEvent): void => {
  let move: CellPosition;
  try {
    move = renderer.toCellPosition(event.offsetX, event.offsetY);
  } catch (error) {
    // 盤の外部がクリックされた場合
    throw error;
  }
  emits('decideMove', move);
};

const resize = (): void => {
  renderer.resize();
  renderer.update(props.board, props.puttableCells);
};

watch(
  () => [props.board, props.puttableCells],
  () => {
    renderer.update(props.board, props.puttableCells);
  }
);

onMounted(() => {
  renderer.setCanvas(canvas.value!);
  renderer.resize();
  renderer.update(props.board, props.puttableCells);
  window.addEventListener('resize', resize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize);
});
</script>

<template>
  <canvas
    ref="canvas"
    @click="decideMove"
  ></canvas>
</template>
