<script setup lang="ts">
useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'My Assets'
const description = 'My Assets is a collection of my assets'
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
  <UApp class="bg-white text-black">
    <UHeader
      class="border-none shadow-none"
      :class="{
        'bg-transparent shadow-none': inHomePage,
        'bg-white text-black': !inHomePage
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

    <UMain class="bg-white text-black">
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
