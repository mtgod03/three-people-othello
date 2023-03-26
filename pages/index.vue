<script setup lang="ts">
import { useDisplay } from 'vuetify';

const { smAndUp } = useDisplay();
</script>

<template>
  <div class="d-flex flex-column justify-space-evenly align-center h-100">
    <div class="text-h4 text-sm-h2 text-lg-h1 font-weight-bold text-center mt-6 px-4 max-w-1366px">
      The <span class="text-gradient">Advanced</span> Othello Played by Three People
    </div>

    <img
      class="img-drop-shadow"
      src="@/assets/hero.png"
      :width="smAndUp ? 350 : 275"
    />

    <div class="d-flex justify-center flex-wrap mb-6">
      <v-btn
        class="mx-3 my-2"
        color="teal"
        size="large"
        to="/online"
      >
        オンラインで遊ぶ
      </v-btn>
      <v-btn
        class="mx-3 my-2"
        color="teal"
        size="large"
        variant="outlined"
        to="/offline"
      >
        オフラインで遊ぶ
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.max-w-1366px {
  max-width: 1366px;
}

.text-gradient {
  color: transparent;
  background: linear-gradient(to right, #008000, #0000ff);
  background-clip: text;
}

.img-drop-shadow {
  filter: drop-shadow(0 0 10px #000000);
}
</style>
