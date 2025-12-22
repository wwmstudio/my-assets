<script setup lang="ts">
useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Nuxt Starter Template'
const description = ''
useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterCard: 'summary_large_image'
})

const colorMode = useColorMode()
colorMode.preference = 'light'
colorMode.value = 'light'

const inHomePage = computed(() => useRoute().path === '/')
</script>

<template>
  <UApp>
    <UHeader
      class="border-none bg-transparent shadow-none backdrop-blur-none"
      :class="{
        'bg-transparent shadow-none': inHomePage,
        'bg-white/70 text-black backdrop-blur-sm': !inHomePage
      }"
      :ui="{
        container: 'max-w-auto'
      }"
      :toggle="false"
    >
      <template #left>
        <NuxtLink to="/">
          <AppLogo
            class="h-6 w-auto shrink-0"
            :class="{
              'text-white': inHomePage,
              'text-black': !inHomePage
            }"
          />
        </NuxtLink>
      </template>

      <template #right>
        <TopNavigation
          :class="{
            'bg-black/25 text-white': inHomePage,
            'bg-transparent text-black': !inHomePage
          }"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>
  </UApp>
</template>

<style>
/* Page transition styles */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.page-enter-to,
.page-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
