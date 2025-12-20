<script setup lang="ts">
import { watch } from 'vue'

const { assets } = useAssets()
const allAssets = computed(() => [...assets.value])

const currentIndex = ref(0)
const progress = ref(0)
const defaultAutoplayDelay = 5000 // 5 seconds for images
const thumbnailsPerPage = 5
const thumbnailPage = ref(0)
let progressTimer: ReturnType<typeof setInterval> | null = null
let autoplayTimer: ReturnType<typeof setInterval> | null = null
let progressStartTime = 0
const currentVideoRef = ref<HTMLVideoElement | null>(null)
const showMainNavButtons = ref(false)
let mouseMoveTimer: ReturnType<typeof setTimeout> | null = null
const mouseTimeoutDelay = 2000 // 2 seconds

// Video controls state
const isVideoPlaying = ref(true)
const videoCurrentTime = ref(0)
const videoDuration = ref(0)
const isVideoMuted = ref(true)
const showVideoControls = ref(false)
const showPlayPauseIndicator = ref(false)
let videoUpdateTimer: ReturnType<typeof setInterval> | null = null
let playPauseIndicatorTimer: ReturnType<typeof setTimeout> | null = null

const carousel = useTemplateRef('carousel')

const currentAsset = computed(() => allAssets.value[currentIndex.value])
const currentAutoplayDelay = computed(() => {
  if (currentAsset.value?.type === 'video' && currentAsset.value.duration) {
    return currentAsset.value.duration * 1000 // Convert seconds to milliseconds
  }
  return defaultAutoplayDelay
})

const thumbnailProgress = computed(() => {
  // For videos, use actual video playback progress
  if (currentAsset.value?.type === 'video' && videoDuration.value > 0) {
    return (videoCurrentTime.value / videoDuration.value) * 100
  }
  // For images, use the autoplay timer progress
  return progress.value
})

const visibleThumbnails = computed(() => {
  const assets = allAssets.value
  if (assets.length === 0) return []
  if (assets.length <= thumbnailsPerPage) return assets

  const start = thumbnailPage.value
  const result: typeof assets = []

  for (let i = 0; i < thumbnailsPerPage; i++) {
    const index = (start + i) % assets.length
    const asset = assets[index]
    if (asset) {
      result.push(asset)
    }
  }

  return result
})

const canGoPrevious = computed(() => allAssets.value.length > thumbnailsPerPage)
const canGoNext = computed(() => allAssets.value.length > thumbnailsPerPage)

const goToPreviousPage = () => {
  if (allAssets.value.length > thumbnailsPerPage) {
    thumbnailPage.value = (thumbnailPage.value - 1 + allAssets.value.length) % allAssets.value.length
  }
}

const goToNextPage = () => {
  if (allAssets.value.length > thumbnailsPerPage) {
    thumbnailPage.value = (thumbnailPage.value + 1) % allAssets.value.length
  }
}

const getThumbnailGlobalIndex = (localIndex: number): number => {
  const assets = allAssets.value
  if (assets.length === 0) return -1
  if (assets.length <= thumbnailsPerPage) {
    return localIndex
  }
  return (thumbnailPage.value + localIndex) % assets.length
}

const goToImage = (index: number) => {
  const globalIndex = getThumbnailGlobalIndex(index)
  carousel.value?.emblaApi?.scrollTo(globalIndex)
  startProgress()
}

const goToPreviousSlide = () => {
  carousel.value?.emblaApi?.scrollPrev()
  startProgress()
  stopAutoplay()
  startAutoplay()
}

const goToNextSlide = () => {
  carousel.value?.emblaApi?.scrollNext()
  startProgress()
  stopAutoplay()
  startAutoplay()
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft') {
    carousel.value?.emblaApi?.scrollPrev()
    startProgress()
    stopAutoplay()
    startAutoplay()
  } else if (e.key === 'ArrowRight') {
    carousel.value?.emblaApi?.scrollNext()
    startProgress()
    stopAutoplay()
    startAutoplay()
  } else if (e.key === ' ' || e.key === 'Spacebar') {
    // Space bar to play/pause video
    e.preventDefault()
    if (currentAsset.value?.type === 'video') {
      toggleVideoPlayPause()
    }
  }
}

const startProgress = () => {
  if (progressTimer) {
    clearInterval(progressTimer)
  }
  progress.value = 0
  progressStartTime = Date.now()
  const delay = currentAutoplayDelay.value

  progressTimer = setInterval(() => {
    const elapsed = Date.now() - progressStartTime
    const newProgress = Math.min((elapsed / delay) * 100, 100)
    progress.value = newProgress

    if (newProgress >= 100) {
      if (progressTimer) {
        clearInterval(progressTimer)
        progressTimer = null
      }
    }
  }, 16) // ~60fps
}

const startAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
  }
  const delay = currentAutoplayDelay.value

  autoplayTimer = setTimeout(() => {
    carousel.value?.emblaApi?.scrollNext()
  }, delay)
}

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearTimeout(autoplayTimer)
    autoplayTimer = null
  }
}

const stopProgress = () => {
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
}

const isAssetVisibleInCurrentPage = (assetIndex: number): boolean => {
  const assets = allAssets.value
  if (assets.length <= thumbnailsPerPage) return true

  const start = thumbnailPage.value
  for (let i = 0; i < thumbnailsPerPage; i++) {
    const index = (start + i) % assets.length
    if (index === assetIndex) {
      return true
    }
  }
  return false
}

const handleSelect = (selectedIndex: number) => {
  currentIndex.value = selectedIndex
  // Only update thumbnail page if the selected asset is not visible in current page
  const assets = allAssets.value
  if (assets.length > thumbnailsPerPage && !isAssetVisibleInCurrentPage(selectedIndex)) {
    thumbnailPage.value = selectedIndex
  }
  startProgress()
  stopAutoplay()
  startAutoplay()

  // Update video ref when a video is selected
  if (currentAsset.value?.type === 'video') {
    nextTick(() => {
      const videoElement = document.querySelector(
        `video[data-asset-id="${currentAsset.value?.id}"]`
      ) as HTMLVideoElement | null
      if (videoElement) {
        // Reset video to beginning and play
        videoElement.currentTime = 0
        videoElement.play().catch(() => {
          // Handle play promise rejection
        })
        currentVideoRef.value = videoElement
        videoDuration.value = videoElement.duration || 0
        videoCurrentTime.value = 0
        isVideoPlaying.value = true
        isVideoMuted.value = videoElement.muted
        startVideoUpdateTimer()
      }
    })
  } else {
    stopVideoUpdateTimer()
    currentVideoRef.value = null
  }
}

const handleVideoLoadedMetadata = (event: Event) => {
  const video = event.target as HTMLVideoElement
  if (video && currentAsset.value?.type === 'video') {
    videoDuration.value = video.duration
    // Update the asset duration if not set or if video duration differs
    const duration = Math.floor(video.duration)
    if (!currentAsset.value.duration || currentAsset.value.duration !== duration) {
      // Note: We can't directly update the readonly asset, but the duration should be set in the store
    }
  }
}

const updateVideoTime = (event?: Event) => {
  const video = event ? (event.target as HTMLVideoElement) : currentVideoRef.value
  if (video && currentAsset.value?.type === 'video' && video === currentVideoRef.value) {
    videoCurrentTime.value = video.currentTime
    videoDuration.value = video.duration || 0
    isVideoPlaying.value = !video.paused
  }
}

const handleVideoEnded = () => {
  isVideoPlaying.value = false
  // Advance to next slide when video ends
  stopProgress()
  stopAutoplay()
  carousel.value?.emblaApi?.scrollNext()
}

const startVideoUpdateTimer = () => {
  if (videoUpdateTimer) {
    clearInterval(videoUpdateTimer)
  }
  videoUpdateTimer = setInterval(() => {
    updateVideoTime()
  }, 100) // Update every 100ms
}

const stopVideoUpdateTimer = () => {
  if (videoUpdateTimer) {
    clearInterval(videoUpdateTimer)
    videoUpdateTimer = null
  }
}

const showPlayPauseIndicatorTemporary = () => {
  showPlayPauseIndicator.value = true

  // Clear existing timer
  if (playPauseIndicatorTimer) {
    clearTimeout(playPauseIndicatorTimer)
  }

  // Hide after 1.5 seconds
  playPauseIndicatorTimer = setTimeout(() => {
    showPlayPauseIndicator.value = false
    playPauseIndicatorTimer = null
  }, 1500)
}

const toggleVideoPlayPause = () => {
  // Get the current video element
  let currentVideo: HTMLVideoElement | null = currentVideoRef.value

  // If ref is not set, find the current video
  if (!currentVideo && currentAsset.value?.type === 'video') {
    currentVideo = document.querySelector(`video[data-asset-id="${currentAsset.value?.id}"]`) as HTMLVideoElement | null
    if (currentVideo) {
      currentVideoRef.value = currentVideo
    }
  }

  if (currentVideo) {
    // Check current state before making changes
    const wasPlaying = !currentVideo.paused

    if (wasPlaying) {
      // Pause the current video
      currentVideo.pause()
      isVideoPlaying.value = false

      // Also pause all other videos to ensure no background audio
      const allVideos = document.querySelectorAll('video')
      allVideos.forEach((video) => {
        if (video !== currentVideo && !video.paused) {
          video.pause()
        }
      })
    } else {
      // Pause all other videos first to ensure no background audio
      const allVideos = document.querySelectorAll('video')
      allVideos.forEach((video) => {
        if (video !== currentVideo && !video.paused) {
          video.pause()
        }
      })

      // Then play the current video
      currentVideo.play().catch(() => {
        // Handle play promise rejection
      })
      isVideoPlaying.value = true
    }

    // Show visual indicator
    showPlayPauseIndicatorTemporary()
  }
}

const handleVideoSeek = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (currentVideoRef.value && target && videoDuration.value > 0) {
    const seekTime = (parseFloat(target.value) / 100) * videoDuration.value
    currentVideoRef.value.currentTime = seekTime
    videoCurrentTime.value = seekTime

    // Reset and restart the slide progress indicator
    startProgress()
    stopAutoplay()
    startAutoplay()
  }
}

const toggleVideoMute = () => {
  if (currentVideoRef.value) {
    if (isVideoMuted.value) {
      currentVideoRef.value.muted = false
      isVideoMuted.value = false
    } else {
      currentVideoRef.value.muted = true
      isVideoMuted.value = true
    }
  }
}

const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const handleMouseMove = () => {
  showMainNavButtons.value = true
  if (currentAsset.value?.type === 'video') {
    showVideoControls.value = true
  }

  // Clear existing timeout
  if (mouseMoveTimer) {
    clearTimeout(mouseMoveTimer)
  }

  // Set new timeout to hide buttons
  mouseMoveTimer = setTimeout(() => {
    showMainNavButtons.value = false
    if (currentAsset.value?.type === 'video') {
      showVideoControls.value = false
    }
    mouseMoveTimer = null
  }, mouseTimeoutDelay)
}

const clearMouseTimer = () => {
  if (mouseMoveTimer) {
    clearTimeout(mouseMoveTimer)
    mouseMoveTimer = null
  }
}

// Watch for asset changes to restart autoplay
watch(currentIndex, () => {
  startProgress()
  stopAutoplay()
  startAutoplay()
  // Video ref is updated in handleSelect, so we don't need to do it here
})

// Disable body scroll when component is mounted
onMounted(() => {
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('mousemove', handleMouseMove)
  startProgress()
  startAutoplay()
})

onUnmounted(() => {
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('mousemove', handleMouseMove)
  stopProgress()
  stopAutoplay()
  stopVideoUpdateTimer()
  clearMouseTimer()
})
</script>

<template>
  <div class="fixed inset-0 m-0 h-screen w-screen overflow-hidden bg-black p-0">
    <UCarousel
      ref="carousel"
      v-slot="{ item }"
      :items="allAssets"
      loop
      :arrows="false"
      :autoplay="false"
      wheel-gestures
      :ui="{
        root: 'h-full w-full m-0 p-0',
        viewport: 'h-full w-full m-0 p-0',
        container: 'h-full w-full m-0 ms-0',
        item: 'h-full w-full basis-full ps-0 m-0'
      }"
      class="m-0 h-full w-full p-0"
      @select="handleSelect"
    >
      <NuxtImg
        v-if="item?.type === 'image'"
        :src="item.url"
        :alt="item.title"
        class="h-full w-full object-cover"
        :width="item.width || 1920"
        :height="item.height || 1080"
        format="webp"
        quality="90"
        loading="lazy"
        sizes="100vw"
      />
      <video
        v-else-if="item?.type === 'video'"
        :data-asset-id="item.id"
        :src="item.url"
        class="h-full w-full cursor-pointer object-cover"
        autoplay
        :muted="isVideoMuted"
        playsinline
        preload="metadata"
        @loadedmetadata="handleVideoLoadedMetadata"
        @timeupdate="updateVideoTime"
        @play="isVideoPlaying = true"
        @pause="isVideoPlaying = false"
        @ended="handleVideoEnded"
        @click="toggleVideoPlayPause"
      />
    </UCarousel>

    <!-- Play/Pause Indicator Overlay -->
    <div
      v-if="currentAsset?.type === 'video' && showPlayPauseIndicator"
      class="pointer-events-none fixed inset-0 z-40 flex items-center justify-center transition-opacity duration-300"
      :class="showPlayPauseIndicator ? 'opacity-100' : 'opacity-0'"
    >
      <div class="flex h-20 w-20 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
        <Icon
          v-if="isVideoPlaying"
          name="material-symbols:play-arrow"
          class="h-12 w-12 text-white"
        />
        <Icon
          v-else
          name="material-symbols:pause"
          class="h-12 w-12 text-white"
        />
      </div>
    </div>

    <!-- Main Slider Navigation Buttons -->
    <div
      v-show="showMainNavButtons"
      class="fixed top-1/2 left-4 z-50 -translate-y-1/2 transition-opacity duration-300"
      :class="showMainNavButtons ? 'opacity-100' : 'opacity-0'"
    >
      <UButton
        icon="i-lucide-chevron-left"
        size="lg"
        color="neutral"
        variant="solid"
        class="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 opacity-70 hover:bg-black/70 hover:opacity-100"
        @click="goToPreviousSlide"
      />
    </div>
    <div
      v-show="showMainNavButtons"
      class="fixed top-1/2 right-4 z-50 -translate-y-1/2 transition-opacity duration-300"
      :class="showMainNavButtons ? 'opacity-100' : 'opacity-0'"
    >
      <UButton
        icon="i-lucide-chevron-right"
        size="lg"
        color="neutral"
        variant="solid"
        class="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 opacity-70 hover:bg-black/70 hover:opacity-100"
        @click="goToNextSlide"
      />
    </div>

    <div class="fixed bottom-4 left-0 z-60 flex w-full items-end justify-end gap-2 px-4">
      <!-- Video Player Controls -->
      <div
        v-if="currentAsset?.type === 'video'"
        v-show="showVideoControls"
        class="flex-1 rounded-full bg-black/50 px-4 py-3 backdrop-blur-sm transition-opacity duration-300"
        :class="showVideoControls ? 'opacity-100' : 'opacity-0'"
      >
        <div class="flex items-center gap-3">
          <!-- Play/Pause Button -->
          <UButton
            :icon="isVideoPlaying ? 'material-symbols:pause' : 'material-symbols:play-arrow'"
            size="sm"
            color="neutral"
            variant="ghost"
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/20"
            @click="toggleVideoPlayPause"
          />

          <!-- Time Display -->
          <div class="shrink-0 text-xs text-white">
            {{ formatTime(videoCurrentTime) }} / {{ formatTime(videoDuration) }}
          </div>

          <!-- Progress Bar -->
          <div class="min-w-0 flex-1">
            <div class="relative h-1 w-full rounded-lg bg-white/20">
              <div
                class="absolute top-0 left-0 h-full rounded-lg bg-white transition-all duration-100"
                :style="{ width: videoDuration > 0 ? `${(videoCurrentTime / videoDuration) * 100}%` : '0%' }"
              />
              <input
                type="range"
                min="0"
                max="100"
                :value="videoDuration > 0 ? (videoCurrentTime / videoDuration) * 100 : 0"
                class="video-seekbar absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent"
                style="width: 100%"
                @input="handleVideoSeek"
              />
            </div>
          </div>

          <!-- Mute/Unmute Button -->
          <UButton
            :icon="isVideoMuted ? 'i-lucide-volume-x' : 'i-lucide-volume-2'"
            size="sm"
            color="neutral"
            variant="ghost"
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/20"
            @click="toggleVideoMute"
          />
        </div>
      </div>
      <div
        v-else
        class="flex-1"
      />

      <!-- Thumbnail Gallery -->
      <div class="flex shrink-0 items-center gap-2">
        <!-- Previous Button -->
        <UButton
          v-if="canGoPrevious"
          icon="i-lucide-chevron-left"
          size="xs"
          color="neutral"
          variant="solid"
          class="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 opacity-70 hover:bg-black/70 hover:opacity-100"
          @click="goToPreviousPage"
        />

        <!-- Thumbnails -->
        <div class="flex gap-2">
          <UButton
            v-for="(asset, index) in visibleThumbnails"
            :key="asset.id"
            size="xs"
            :ui="{
              base: 'border-0'
            }"
            class="relative h-20 w-20 shrink-0 overflow-visible rounded-lg p-0 transition-all hover:scale-110"
            :class="[currentIndex === thumbnailPage * thumbnailsPerPage + index ? 'ring-white' : '']"
            @click="goToImage(index)"
          >
            <NuxtImg
              v-if="asset.type === 'image'"
              :src="asset.thumbnail || asset.url"
              :alt="asset.title"
              class="h-full w-full rounded-lg object-cover"
              width="80"
              height="80"
              format="webp"
              quality="85"
              loading="lazy"
            />
            <div
              v-else-if="asset.type === 'video'"
              class="relative flex h-full w-full items-center justify-center rounded-lg bg-black/50"
            >
              <NuxtImg
                v-if="asset.thumbnail"
                :src="asset.thumbnail"
                :alt="asset.title"
                class="h-full w-full rounded-lg object-cover opacity-50"
                width="80"
                height="80"
                format="webp"
                quality="85"
                loading="lazy"
              />
              <div class="absolute inset-0 flex items-center justify-center">
                <!-- Show play/pause icon based on current state if this is the active video -->
                <template v-if="getThumbnailGlobalIndex(index) === currentIndex">
                  <Icon
                    v-if="isVideoPlaying"
                    name="material-symbols:play-arrow"
                    class="h-8 w-8 text-white"
                  />
                  <Icon
                    v-else
                    name="material-symbols:pause"
                    class="h-8 w-8 text-white"
                  />
                </template>
                <Icon
                  v-else
                  name="material-symbols:play-arrow"
                  class="h-8 w-8 text-white"
                />
              </div>
            </div>
            <div
              v-if="getThumbnailGlobalIndex(index) === currentIndex"
              class="absolute inset-0 rounded-lg bg-white/20"
            />
            <!-- Edge Progress Indicator -->
            <svg
              v-if="getThumbnailGlobalIndex(index) === currentIndex"
              class="progress-svg pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 80 80"
            >
              <path
                class="progress-path"
                :stroke-dasharray="320"
                :stroke-dashoffset="320 - (320 * thumbnailProgress) / 100"
                d="M 0,8 A 8,8 0 0,1 8,0 L 72,0 A 8,8 0 0,1 80,8 L 80,72 A 8,8 0 0,1 72,80 L 8,80 A 8,8 0 0,1 0,72 Z"
              />
            </svg>
          </UButton>
        </div>

        <!-- Next Button -->
        <UButton
          v-if="canGoNext"
          icon="i-lucide-chevron-right"
          size="xs"
          color="neutral"
          variant="solid"
          class="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 opacity-70 hover:bg-black/70 hover:opacity-100"
          @click="goToNextPage"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.progress-border {
  overflow: hidden;
}

.progress-svg .progress-path {
  fill: none;
  stroke: white;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: stroke-dashoffset 0.05s linear;
}

.video-seekbar {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  outline: none;
  width: 100% !important;
  height: 100%;
}

.video-seekbar::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.video-seekbar:hover::-webkit-slider-thumb {
  opacity: 1;
}

.video-seekbar::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: none;
  opacity: 0;
  transition: opacity 0.2s;
}

.video-seekbar:hover::-moz-range-thumb {
  opacity: 1;
}

.video-seekbar::-moz-range-track {
  background: transparent;
}
</style>
