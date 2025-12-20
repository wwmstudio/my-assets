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
      class="border-none shadow-none backdrop-blur-none"
      :class="{
        'bg-transparent': inHomePage,
        'bg-black': !inHomePage
      }"
      :ui="{
        container: 'max-w-auto'
      }"
    >
      <template #left>
        <NuxtLink to="/">
          <AppLogo class="h-6 w-auto shrink-0" />
        </NuxtLink>
      </template>

      <template #right>
        <TopNavigation />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>
  </UApp>
</template>
