// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  components: true,
  css: ['./assets/css/main.css'],
  modules: [
      '@nuxtjs/supabase',
      'nuxt-icons',
      "@nuxt/ui",
      "@nuxtjs/tailwindcss"
  ],
  supabase: {
    redirect: false,
  },
  app: {
      head: {
          title: "To Do It!",
          link: [
              { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
          ]
      }
  }
})