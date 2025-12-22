<template>
  <div class="container-fluid mx-auto px-4 py-8">
    <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <div
        v-for="(asset, index) in allAssets"
        :key="asset.id"
        tabindex="0"
        role="button"
        :aria-label="`Open ${asset.title} in lightbox`"
        class="tile-enter group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-900 transition-transform focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        :style="{ animationDelay: `${index * 0.05}s` }"
        @click="openLightbox(index)"
        @keydown.enter="openLightbox(index)"
        @keydown.space.prevent="openLightbox(index)"
      >
        <!-- Image Asset -->
        <NuxtImg
          v-if="asset.type === 'image'"
          :src="asset.thumbnail || asset.url"
          :alt="asset.title"
          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-1"
          width="300"
          height="300"
          format="webp"
          quality="85"
          loading="lazy"
        />

        <!-- Video Asset -->
        <div
          v-else-if="asset.type === 'video'"
          class="relative flex h-full w-full items-center justify-center bg-black"
        >
          <NuxtImg
            v-if="asset.thumbnail"
            :src="asset.thumbnail"
            :alt="asset.title"
            class="h-full w-full object-cover opacity-50 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-1"
            width="300"
            height="300"
            format="webp"
            quality="85"
            loading="lazy"
          />
          <div class="absolute inset-0 flex items-center justify-center">
            <svg
              class="h-12 w-12 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        <!-- Overlay with title -->
        <div class="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-4">
          <h3 class="text-sm font-semibold text-white">
            {{ asset.title }}
          </h3>
          <p
            v-if="asset.description"
            class="mt-1 text-xs text-white/80"
          >
            {{ asset.description }}
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="allAssets.length === 0"
      class="flex h-64 items-center justify-center"
    >
      <p class="text-gray-500">No assets found</p>
    </div>

    <!-- Lightbox -->
    <LightBox
      v-model="isLightboxOpen"
      :assets="allAssets as Asset[]"
      :initial-index="lightboxIndex"
      @update:index="lightboxIndex = $event"
    />
  </div>
</template>

<script setup lang="ts">
import type { Asset } from '~/types/asset'

definePageMeta({
  pageTransition: {
    name: 'page',
    mode: 'out-in'
  }
})

const { assets } = useAssets()
const allAssets = computed(() => [...assets.value])

// Lightbox state
const isLightboxOpen = ref(false)
const lightboxIndex = ref(0)

// Lightbox functions
const openLightbox = (index: number) => {
  lightboxIndex.value = index
  isLightboxOpen.value = true
}
</script>

<style scoped>
@keyframes tileFadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tile-enter {
  animation: tileFadeInUp 0.6s ease-out forwards;
  opacity: 0;
}
</style>
