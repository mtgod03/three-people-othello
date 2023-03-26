<script setup lang="ts">
import { mdiCircle } from '@mdi/js';

defineProps<{
  playerName: string;
  color: string;
  score: number;
  isMyTurn: boolean;
}>();
</script>

<template>
  <v-sheet
    class="text-body-1 mx-2 my-1 pa-1"
    width="225"
    :color="isMyTurn ? '#ffff80' : '#ffffff'"
    rounded
  >
    <v-icon
      :icon="mdiCircle"
      :color="color"
    ></v-icon>
    {{ playerName }}
    <span class="float-right">{{ score }}</span>
  </v-sheet>
</template>
