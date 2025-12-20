<template>
  <div class="flex items-center justify-end gap-2 rounded-full bg-black/25 px-4 py-2 text-white">
    <NuxtLink
      v-for="item in items"
      :key="item.label"
      :to="item.to"
      class="hover:bg-ui-primary/10 flex items-center justify-center rounded-full p-2 transition-all duration-300 hover:scale-110"
      active-class="text-ui-primary"
    >
      <UTooltip
        :key="item.label"
        :text="item.label"
      >
        <UIcon :name="item.icon" />
      </UTooltip>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<Array<NavigationMenuItem>>([
  {
    label: 'Home',
    to: '/',
    icon: 'material-symbols-light:family-home-outline'
  },
  {
    label: 'Grid',
    to: '/grid',
    icon: 'i-lucide-grid-2x2'
  },
  {
    label: 'Bento',
    to: '/bento',
    icon: 'mingcute:grid-2-line'
  }
])
</script>

<style></style>
