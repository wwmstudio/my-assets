<template>
  <div>
    <div class="container-fluid mx-auto px-4 py-8">
      <div class="masonry-grid">
        <div
          v-for="(asset, index) in allAssets"
          :key="asset.id"
          :style="getAssetStyle(asset)"
          tabindex="0"
          role="button"
          :aria-label="`Open ${asset.title} in lightbox`"
          class="masonry-item group relative cursor-pointer overflow-hidden rounded-lg bg-gray-900 transition-transform hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          @click="openLightbox(index)"
          @keydown.enter="openLightbox(index)"
          @keydown.space.prevent="openLightbox(index)"
        >
          <!-- Image Asset -->
          <NuxtImg
            v-if="asset.type === 'image'"
            :src="asset.thumbnail || asset.url"
            :alt="asset.title"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            :width="asset.width || 400"
            :height="asset.height || 400"
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
              class="h-full w-full object-cover opacity-50 transition-transform duration-300 group-hover:scale-110"
              :width="asset.width || 400"
              :height="asset.height || 400"
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

type AssetDimensions = {
  width?: number
  height?: number
}

const { assets } = useAssets()
const allAssets = computed(() => [...assets.value])

// Calculate style based on aspect ratio for masonry layout
const getAssetStyle = (asset: AssetDimensions) => {
  const width = asset.width || 1920
  const height = asset.height || 1080
  const aspectRatio = width / height

  // For masonry, we maintain the aspect ratio
  // The width will be controlled by CSS columns
  return {
    aspectRatio: `${aspectRatio || 1}`
  }
}

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
.masonry-grid {
  column-count: 2;
  column-gap: 1rem;
  column-fill: balance;
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 1rem;
  width: 100%;
  display: inline-block;
}

@media (min-width: 640px) {
  .masonry-grid {
    column-count: 2;
  }
}

@media (min-width: 768px) {
  .masonry-grid {
    column-count: 3;
  }
}

@media (min-width: 1024px) {
  .masonry-grid {
    column-count: 4;
  }
}

@media (min-width: 1280px) {
  .masonry-grid {
    column-count: 5;
  }
}

@media (min-width: 1536px) {
  .masonry-grid {
    column-count: 6;
  }
}
</style>
