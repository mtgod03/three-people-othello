<script setup lang="ts">
import { mdiHome, mdiWifi, mdiWifiOff } from '@mdi/js';

useHead({
  title: '3人オセロ',
  htmlAttrs: {
    lang: 'ja',
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
});

const drawer = ref(false);

const pages = [
  { title: 'ホーム', props: { prependIcon: mdiHome, to: '/' } },
  { title: 'オンラインで遊ぶ', props: { prependIcon: mdiWifi, to: '/online' } },
  { title: 'オフラインで遊ぶ', props: { prependIcon: mdiWifiOff, to: '/offline' } },
];
</script>

<template>
  <v-app>
    <v-app-bar
      color="teal"
      density="comfortable"
    >
      <v-app-bar-nav-icon
        class="absolute"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-app-bar-title class="text-center">
        <NuxtLink
          class="text-h6 text-white text-decoration-none"
          to="/"
        >
          3人オセロ
        </NuxtLink>
      </v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      class="bg-teal-lighten-5"
      disable-resize-watcher
    >
      <v-list
        :items="pages"
        density="comfortable"
        nav
      ></v-list>
    </v-navigation-drawer>

    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<style scoped>
.absolute {
  position: absolute;
}
</style>
