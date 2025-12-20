<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bento-grid grid auto-rows-fr gap-4">
      <div
        v-for="(asset, index) in allAssets"
        :key="asset.id"
        :class="getBentoClass(index)"
        class="group relative cursor-pointer overflow-hidden rounded-lg bg-gray-900 transition-transform"
      >
        <!-- Image Asset -->
        <NuxtImg
          v-if="asset.type === 'image'"
          :src="asset.thumbnail || asset.url"
          :alt="asset.title"
          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-1"
          :width="getImageWidth(index)"
          :height="getImageHeight(index)"
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
            :width="getImageWidth(index)"
            :height="getImageHeight(index)"
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
        <div
          class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100"
        >
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
</template>

<script setup lang="ts">
const { assets } = useAssets()
const allAssets = computed(() => [...assets.value])

// Bento grid pattern - creates varying sizes for visual interest
const getBentoClass = (index: number): string => {
  const patterns: string[] = [
    'col-span-1 row-span-1', // Small
    'col-span-2 row-span-1', // Wide
    'col-span-1 row-span-2', // Tall
    'col-span-2 row-span-2', // Large
    'col-span-1 row-span-1', // Small
    'col-span-1 row-span-1', // Small
    'col-span-2 row-span-1', // Wide
    'col-span-1 row-span-1' // Small
  ]
  return patterns[index % patterns.length] || 'col-span-1 row-span-1'
}

const getImageWidth = (index: number): number => {
  const classStr = getBentoClass(index)
  if (classStr.includes('col-span-2')) {
    return 600
  }
  return 300
}

const getImageHeight = (index: number): number => {
  const classStr = getBentoClass(index)
  if (classStr.includes('row-span-2')) {
    return 600
  }
  return 300
}
</script>

<style scoped>
.bento-grid {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

@media (min-width: 640px) {
  .bento-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1024px) {
  .bento-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
