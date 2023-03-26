<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { Turn } from '@/constants/game';

defineProps<{
  playerNames: {
    player1: string;
    player2: string;
    player3: string;
  };
  scores: {
    player1: number;
    player2: number;
    player3: number;
  };
  turn: Turn;
}>();

const { smAndUp } = useDisplay();
</script>

<template>
  <v-card width="fit-content">
    <v-card-text class="d-sm-flex">
      <TheScorePanelText
        :player-name="playerNames.player1"
        :score="scores.player1"
        :is-my-turn="turn === Turn.PLAYER_1"
        color="#ff0000"
      />
      <v-divider
        :vertical="smAndUp"
        class="border-opacity-25"
      ></v-divider>
      <TheScorePanelText
        :player-name="playerNames.player2"
        :score="scores.player2"
        :is-my-turn="turn === Turn.PLAYER_2"
        color="#008000"
      />
      <v-divider
        :vertical="smAndUp"
        class="border-opacity-25"
      ></v-divider>
      <TheScorePanelText
        :player-name="playerNames.player3"
        :score="scores.player3"
        :is-my-turn="turn === Turn.PLAYER_3"
        color="#0000ff"
      />
    </v-card-text>
  </v-card>
</template>
