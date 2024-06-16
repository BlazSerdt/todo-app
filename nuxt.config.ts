// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  components: true,
  css: ["./assets/css/main.css"],
  modules: ["@nuxtjs/supabase"],
})