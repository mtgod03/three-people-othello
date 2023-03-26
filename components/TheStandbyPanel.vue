<script setup lang="ts">
import { useDisplay } from 'vuetify';

defineEmits<{
  (e: 'leave'): void;
}>();

const { smAndUp } = useDisplay();
</script>

<template>
  <v-card :width="smAndUp ? 400 : 300">
    <template v-slot:loader>
      <v-progress-linear
        color="teal"
        indeterminate
      ></v-progress-linear>
    </template>

    <template v-slot:title>
      <span class="text-teal">待機中</span>
    </template>

    <template v-slot:text>
      他のプレイヤーが参加するのを待っています。
    </template>

    <template v-slot:actions>
      <v-btn @click="$emit('leave')">退出</v-btn>
    </template>
  </v-card>
</template>
