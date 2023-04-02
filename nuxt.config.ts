import vuetify from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  css: ['vuetify/styles'],
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    async (options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins!.push(vuetify());
      });
    },
  ],
  nitro: {
    prerender: {
      routes: ['/', '/online', '/online/game', '/offline', '/offline/game'],
    },
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
  typescript: {
    shim: false,
  },
});
