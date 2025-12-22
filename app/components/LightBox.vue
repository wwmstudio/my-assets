<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      ref="lightboxContainerRef"
      class="fixed inset-0 z-50 flex flex-col bg-black"
      @click.self="handleClose"
    >
      <!-- Close and Fullscreen Buttons -->
      <div class="absolute top-4 right-4 z-50 flex gap-2">
        <!-- Fullscreen Button -->
        <button
          class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition-opacity hover:bg-white/20"
          @click="toggleFullscreen"
        >
          <Icon
            :name="isFullscreen ? 'i-lucide-minimize' : 'i-lucide-maximize'"
            class="h-6 w-6"
          />
        </button>
        <!-- Close Button -->
        <button
          class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition-opacity hover:bg-white/20"
          @click="handleClose"
        >
          <Icon
            name="i-lucide-x"
            class="h-6 w-6"
          />
        </button>
      </div>

      <!-- Main Content Area -->
      <div class="relative flex flex-1 items-center justify-center overflow-hidden">
        <!-- Previous Button -->
        <button
          v-if="assets.length > 1"
          :disabled="currentIndex <= 0"
          class="absolute left-4 z-40 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition-opacity hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-black/50"
          @click="goToPrevious"
        >
          <Icon
            name="i-lucide-chevron-left"
            class="h-6 w-6"
          />
        </button>

        <!-- Image Display with Zoom/Rotate -->
        <div
          v-if="currentAsset?.type === 'image'"
          class="relative h-full w-full overflow-hidden"
        >
          <img
            ref="lightboxImageRef"
            :src="currentAsset.url"
            :alt="currentAsset.title"
            class="h-full w-full object-contain"
            :class="{
              'transition-transform duration-300': imageRotation !== 0 && !isDragging,
              'cursor-grab': canDragImage && !isDragging,
              'cursor-grabbing': isDragging
            }"
            :style="imageTransform"
            @wheel="handleImageWheel"
            @mousedown="handleImageMouseDown"
            @mousemove="handleImageMouseMove"
            @mouseup="handleImageMouseUp"
            @mouseleave="handleImageMouseUp"
            @touchstart="handleImageTouchStart"
            @touchmove="handleImageTouchMove"
            @touchend="handleImageTouchEnd"
          />

          <!-- Image Controls (Zoom/Rotate) -->
          <div
            v-if="currentAsset?.type === 'image'"
            class="absolute bottom-1 left-1/2 z-40 -translate-x-1/2 rounded-lg bg-black/50 p-2"
          >
            <div class="relative flex items-center gap-2">
              <UTooltip
                text="Zoom In"
                :popper="{ placement: 'top', strategy: 'fixed' }"
              >
                <UButton
                  icon="i-lucide-zoom-in"
                  size="sm"
                  color="neutral"
                  variant="ghost"
                  class="cursor-pointer text-white hover:bg-white/20"
                  @click="zoomIn"
                />
              </UTooltip>
              <UTooltip
                text="Zoom Out"
                :popper="{ placement: 'top', strategy: 'fixed' }"
              >
                <UButton
                  icon="i-lucide-zoom-out"
                  size="sm"
                  color="neutral"
                  variant="ghost"
                  class="cursor-pointer text-white hover:bg-white/20"
                  @click="zoomOut"
                />
              </UTooltip>
              <UTooltip
                text="Rotate"
                :popper="{ placement: 'top', strategy: 'fixed' }"
              >
                <UButton
                  icon="i-lucide-rotate-cw"
                  size="sm"
                  color="neutral"
                  variant="ghost"
                  class="cursor-pointer text-white hover:bg-white/20"
                  @click="rotateImage"
                />
              </UTooltip>
              <UTooltip
                text="Reset"
                :popper="{ placement: 'top', strategy: 'fixed' }"
              >
                <UButton
                  icon="i-lucide-refresh-cw"
                  size="sm"
                  color="neutral"
                  variant="ghost"
                  class="cursor-pointer text-white hover:bg-white/20"
                  @click="resetImageTransform"
                />
              </UTooltip>
            </div>
          </div>
        </div>

        <!-- Video Display -->
        <div
          v-else-if="currentAsset?.type === 'video'"
          class="relative h-full w-full"
        >
          <video
            ref="lightboxVideoRef"
            :src="currentAsset.url"
            :poster="currentAsset.thumbnail"
            class="h-full w-full object-contain"
            :muted="isVideoMuted"
            playsinline
            preload="metadata"
            @loadedmetadata="handleVideoLoadedMetadata"
            @loadeddata="handleVideoLoadedData"
            @timeupdate="updateVideoTime"
            @play="handleVideoPlay"
            @pause="handleVideoPause"
            @ended="handleVideoEnded"
            @click="toggleVideoPlayPause"
          />

          <!-- Video Controls -->
          <div
            v-show="showVideoControls"
            class="absolute right-0 bottom-1 left-0 mx-auto w-full max-w-2xl rounded-lg bg-black/70 p-4 transition-opacity"
            :class="showVideoControls ? 'opacity-100' : 'opacity-0'"
            @mouseenter="handleControlsMouseEnter"
            @mouseleave="handleControlsMouseLeave"
          >
            <div class="flex items-center gap-3">
              <!-- Play/Pause Button -->
              <button
                class="flex h-10 w-10 items-center justify-center text-white"
                @click="toggleVideoPlayPause"
              >
                <Icon
                  v-if="isVideoPlaying"
                  name="material-symbols:pause"
                  class="h-6 w-6"
                />
                <Icon
                  v-else
                  name="material-symbols:play-arrow"
                  class="h-6 w-6"
                />
              </button>

              <!-- Time Display -->
              <span class="text-sm text-white">
                {{ formatTime(videoCurrentTime) }} / {{ formatTime(videoDuration) }}
              </span>

              <!-- Seekbar -->
              <div class="min-w-0 flex-1">
                <div class="relative h-1 w-full rounded-lg bg-white/20">
                  <div
                    class="absolute top-0 left-0 h-full rounded-lg bg-white transition-all duration-100"
                    :style="{
                      width: videoDuration > 0 ? `${(videoCurrentTime / videoDuration) * 100}%` : '0%'
                    }"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    :value="videoDuration > 0 ? (videoCurrentTime / videoDuration) * 100 : 0"
                    class="video-seekbar absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent"
                    @input="handleVideoSeek"
                  />
                </div>
              </div>

              <!-- Mute Button -->
              <button
                class="flex h-10 w-10 items-center justify-center text-white"
                @click="toggleMute"
              >
                <Icon
                  v-if="isVideoMuted"
                  name="material-symbols:volume-off"
                  class="h-6 w-6"
                />
                <Icon
                  v-else
                  name="material-symbols:volume-up"
                  class="h-6 w-6"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Next Button -->
        <button
          v-if="assets.length > 1"
          :disabled="currentIndex >= assets.length - 1"
          class="absolute right-4 z-40 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition-opacity hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-black/50"
          @click="goToNext"
        >
          <Icon
            name="i-lucide-chevron-right"
            class="h-6 w-6"
          />
        </button>

        <!-- Seek Indicator Overlay -->
        <div
          v-if="currentAsset?.type === 'video' && showSeekIndicator"
          class="pointer-events-none absolute top-1/2 z-50 -translate-y-1/2 transition-opacity duration-300"
          :class="[seekIndicatorAmount < 0 ? 'left-4' : 'right-4', showSeekIndicator ? 'opacity-100' : 'opacity-0']"
        >
          <div class="flex items-center gap-2 rounded-full bg-black/60 px-4 py-3 backdrop-blur-sm">
            <Icon
              :name="seekIndicatorAmount < 0 ? 'i-lucide-rewind' : 'i-lucide-fast-forward'"
              class="h-6 w-6 text-white"
            />
            <span class="text-lg font-semibold text-white">
              {{ seekIndicatorAmount > 0 ? '+' : '' }}{{ seekIndicatorAmount }}s
            </span>
          </div>
        </div>

        <!-- Play/Pause Indicator Overlay -->
        <div
          v-if="currentAsset?.type === 'video' && showPlayPauseIndicator"
          class="pointer-events-none absolute inset-0 z-50 flex items-center justify-center transition-opacity duration-300"
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
      </div>

      <!-- Bottom Thumbnails -->
      <div
        v-show="showThumbnails"
        class="relative border-t border-gray-800 bg-black/50 transition-all"
      >
        <div class="container mx-auto px-4 py-4">
          <div
            ref="thumbnailContainerRef"
            class="scrollbar-hide flex items-center gap-2 overflow-x-auto"
            :style="thumbnailContainerStyle"
          >
            <div
              v-for="(asset, index) in allThumbnails"
              :key="asset.id"
              class="relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded border-2 transition-all"
              :class="index === currentIndex ? 'border-white' : 'border-transparent'"
              @click="goToThumbnail(index)"
            >
              <NuxtImg
                v-if="asset.type === 'image'"
                :src="asset.thumbnail || asset.url"
                :alt="asset.title"
                class="h-full w-full object-cover"
                width="64"
                height="64"
                format="webp"
                quality="80"
              />
              <div
                v-else-if="asset.type === 'video'"
                class="relative h-full w-full bg-black"
              >
                <NuxtImg
                  v-if="asset.thumbnail"
                  :src="asset.thumbnail"
                  :alt="asset.title"
                  class="h-full w-full object-cover opacity-50"
                  width="64"
                  height="64"
                  format="webp"
                  quality="80"
                />
                <div class="absolute inset-0 flex items-center justify-center">
                  <Icon
                    name="material-symbols:play-arrow"
                    class="h-4 w-4 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Thumbnail Toggle Button -->
      <div
        class="absolute right-1 z-50"
        :class="{
          'bottom-[calc(calc(var(--spacing)*24)+1px)]': showThumbnails,
          'bottom-0': !showThumbnails
        }"
      >
        <div class="relative">
          <UTooltip
            :text="showThumbnails ? 'Hide Thumbnails' : 'Show Thumbnails'"
            :popper="{ placement: 'top', strategy: 'fixed' }"
          >
            <button
              class="flex h-6 w-10 cursor-pointer items-center justify-center rounded-t-sm bg-black/50 text-white transition-opacity hover:bg-white/20"
              @click="toggleThumbnails"
            >
              <Icon
                v-if="showThumbnails"
                name="i-lucide-chevron-down"
                class="h-5 w-5"
              />
              <Icon
                v-else
                name="i-lucide-chevron-up"
                class="h-5 w-5"
              />
            </button>
          </UTooltip>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { Asset } from '~/types/asset'

type FlexibleAsset = Omit<Asset, 'tags'> & {
  tags?: readonly string[] | string[]
}

interface Props {
  modelValue: boolean
  assets: readonly FlexibleAsset[] | FlexibleAsset[]
  initialIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialIndex: 0
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:index': [index: number]
}>()

const currentIndex = ref(props.initialIndex)
const currentAsset = computed(() => props.assets[currentIndex.value])

// Fullscreen state
const isFullscreen = ref(false)
const lightboxContainerRef = ref<HTMLElement | null>(null)

// Image transform state
const imageScale = ref(1)
const imageRotation = ref(0)
const imageTranslateX = ref(0)
const imageTranslateY = ref(0)
const lightboxImageRef = ref<HTMLImageElement | null>(null)

// Drag state
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const imageTranslateXStart = ref(0)
const imageTranslateYStart = ref(0)

const imageTransform = computed(() => {
  // Use modulo for display to show correct visual rotation, but keep rotation value incrementing
  // This ensures continuous forward rotation animation even when going from 270° to 0°
  // const displayRotation = imageRotation.value % 360
  return {
    transform: `translate(${imageTranslateX.value}px, ${imageTranslateY.value}px) scale(${imageScale.value}) rotate(${imageRotation.value}deg)`,
    transformOrigin: 'center center'
  }
})

const imageRotationResetTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

// Watch image scale to reset translation when zoomed out to minimum
watch(imageScale, (newScale) => {
  const minScale = getMinZoomScale()
  if (newScale <= minScale) {
    imageTranslateX.value = 0
    imageTranslateY.value = 0
  }
})

watch(imageRotation, (newRotation) => {
  if (newRotation === 360) {
    if (imageRotationResetTimeout.value) {
      clearTimeout(imageRotationResetTimeout.value)
      imageRotationResetTimeout.value = null
    }
    imageRotationResetTimeout.value = setTimeout(() => {
      imageRotation.value = 0
    }, 1000)
  } else {
    if (imageRotationResetTimeout.value) {
      clearTimeout(imageRotationResetTimeout.value)
      imageRotationResetTimeout.value = null
    }
  }
})

// Video state
const lightboxVideoRef = ref<HTMLVideoElement | null>(null)
// Global video state that persists across navigation
const globalVideoPlayingState = ref(false) // Global play/pause state for the lightbox
const isVideoPlaying = ref(false) // Current video's play state (synced with global)
const videoCurrentTime = ref(0)
const videoDuration = ref(0)
const isVideoMuted = ref(true) // Global mute state that persists across navigation
const showVideoControls = ref(true)
let videoUpdateTimer: ReturnType<typeof setInterval> | null = null
let mouseMoveTimer: ReturnType<typeof setTimeout> | null = null
const mouseTimeoutDelay = 2000
const isMouseOverControls = ref(false)

// Seek indicator
const showSeekIndicator = ref(false)
const seekIndicatorAmount = ref(0)
const accumulatedSeekAmount = ref(0)
let seekIndicatorTimer: ReturnType<typeof setTimeout> | null = null

// Play/Pause indicator
const showPlayPauseIndicator = ref(false)
let playPauseIndicatorTimer: ReturnType<typeof setTimeout> | null = null

// Thumbnail navigation
const showThumbnails = ref(true) // Toggle state for thumbnail visibility
const thumbnailContainerRef = ref<HTMLDivElement | null>(null)
const allThumbnails = computed(() => props.assets)
const thumbnailContainerStyle = ref({ paddingLeft: '0px', paddingRight: '0px' })

const toggleThumbnails = () => {
  showThumbnails.value = !showThumbnails.value
}

const updateThumbnailPadding = () => {
  if (!thumbnailContainerRef.value) return
  const container = thumbnailContainerRef.value
  const containerWidth = container.clientWidth
  // Add padding equal to half the container width on each side to allow centering
  const padding = `${containerWidth / 2}px`
  thumbnailContainerStyle.value = {
    paddingLeft: padding,
    paddingRight: padding
  }
}

const scrollToThumbnail = (index: number) => {
  if (!thumbnailContainerRef.value) return
  const thumbnailElement = thumbnailContainerRef.value.children[index] as HTMLElement
  if (!thumbnailElement) return

  // Use scrollIntoView to center the element smoothly
  thumbnailElement.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center'
  })
}

// Lightbox functions
const handleClose = () => {
  // Exit fullscreen if active
  if (isFullscreen.value) {
    exitFullscreen()
  }
  emit('update:modelValue', false)
  if (lightboxVideoRef.value) {
    lightboxVideoRef.value.pause()
    stopVideoUpdateTimer()
  }
  document.body.style.overflow = ''
}

const toggleFullscreen = () => {
  if (isFullscreen.value) {
    exitFullscreen()
  } else {
    enterFullscreen()
  }
}

const enterFullscreen = () => {
  const container = lightboxContainerRef.value
  if (!container) return

  if (container.requestFullscreen) {
    container.requestFullscreen()
  } else {
    const containerWithVendor = container as HTMLElement & {
      webkitRequestFullscreen?: () => void
      msRequestFullscreen?: () => void
    }
    if (containerWithVendor.webkitRequestFullscreen) {
      // Safari
      containerWithVendor.webkitRequestFullscreen()
    } else if (containerWithVendor.msRequestFullscreen) {
      // IE/Edge
      containerWithVendor.msRequestFullscreen()
    }
  }
}

const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else {
    const docWithVendor = document as Document & {
      webkitExitFullscreen?: () => void
      msExitFullscreen?: () => void
    }
    if (docWithVendor.webkitExitFullscreen) {
      // Safari
      docWithVendor.webkitExitFullscreen()
    } else if (docWithVendor.msExitFullscreen) {
      // IE/Edge
      docWithVendor.msExitFullscreen()
    }
  }
}

// Listen for fullscreen changes
const handleFullscreenChange = () => {
  const docWithVendor = document as Document & {
    webkitFullscreenElement?: Element | null
    msFullscreenElement?: Element | null
  }
  isFullscreen.value = !!(
    document.fullscreenElement ||
    docWithVendor.webkitFullscreenElement ||
    docWithVendor.msFullscreenElement
  )
}

const goToPrevious = () => {
  if (props.assets.length === 0) return
  if (currentIndex.value <= 0) return // Stop at start
  currentIndex.value = currentIndex.value - 1
  emit('update:index', currentIndex.value)
  imageScale.value = 1
  imageRotation.value = 0
  imageTranslateX.value = 0
  imageTranslateY.value = 0
  // Scrolling will be handled by the watcher
  if (currentAsset.value?.type === 'video') {
    nextTick(() => {
      if (lightboxVideoRef.value) {
        lightboxVideoRef.value.currentTime = 0
        // Apply global mute state
        lightboxVideoRef.value.muted = isVideoMuted.value
        // Apply global play state
        if (globalVideoPlayingState.value) {
          lightboxVideoRef.value.currentTime = 0
          lightboxVideoRef.value.play().catch(() => {})
          isVideoPlaying.value = true
          startVideoUpdateTimer()
        } else {
          // When paused, seek to first frame to show it instead of black screen
          lightboxVideoRef.value.currentTime = 0.1
          isVideoPlaying.value = false
        }
      }
    })
  }
}

const goToNext = () => {
  if (props.assets.length === 0) return
  if (currentIndex.value >= props.assets.length - 1) return // Stop at end
  currentIndex.value = currentIndex.value + 1
  emit('update:index', currentIndex.value)
  imageScale.value = 1
  imageRotation.value = 0
  imageTranslateX.value = 0
  imageTranslateY.value = 0
  // Scrolling will be handled by the watcher
  if (currentAsset.value?.type === 'video') {
    nextTick(() => {
      if (lightboxVideoRef.value) {
        lightboxVideoRef.value.currentTime = 0
        // Apply global mute state
        lightboxVideoRef.value.muted = isVideoMuted.value
        // Apply global play state
        if (globalVideoPlayingState.value) {
          lightboxVideoRef.value.currentTime = 0
          lightboxVideoRef.value.play().catch(() => {})
          isVideoPlaying.value = true
          startVideoUpdateTimer()
        } else {
          // When paused, seek to first frame to show it instead of black screen
          lightboxVideoRef.value.currentTime = 0.1
          isVideoPlaying.value = false
        }
      }
    })
  }
}

const goToThumbnail = (index: number) => {
  currentIndex.value = index
  emit('update:index', currentIndex.value)
  imageScale.value = 1
  imageRotation.value = 0
  imageTranslateX.value = 0
  imageTranslateY.value = 0
  // Scrolling will be handled by the watcher
  if (currentAsset.value?.type === 'video') {
    nextTick(() => {
      if (lightboxVideoRef.value) {
        lightboxVideoRef.value.currentTime = 0
        // Apply global mute state
        lightboxVideoRef.value.muted = isVideoMuted.value
        // Apply global play state
        if (globalVideoPlayingState.value) {
          lightboxVideoRef.value.currentTime = 0
          lightboxVideoRef.value.play().catch(() => {})
          isVideoPlaying.value = true
          startVideoUpdateTimer()
        } else {
          // When paused, seek to first frame to show it instead of black screen
          lightboxVideoRef.value.currentTime = 0.1
          isVideoPlaying.value = false
        }
      }
    })
  }
}

// Image controls
const getMinZoomScale = (): number => {
  if (!lightboxImageRef.value) return 1

  const img = lightboxImageRef.value
  const container = img.parentElement
  if (!container) return 1

  // Get natural image dimensions
  const naturalWidth = img.naturalWidth || 0
  const naturalHeight = img.naturalHeight || 0

  if (naturalWidth === 0 || naturalHeight === 0) return 1

  // Get displayed dimensions (object-contain maintains aspect ratio)
  const containerWidth = container.clientWidth
  const containerHeight = container.clientHeight

  // Calculate displayed size maintaining aspect ratio
  const containerAspect = containerWidth / containerHeight
  const imageAspect = naturalWidth / naturalHeight

  let displayedWidth: number
  let displayedHeight: number

  if (imageAspect > containerAspect) {
    // Image is wider - fit to width
    displayedWidth = containerWidth
    displayedHeight = containerWidth / imageAspect
  } else {
    // Image is taller - fit to height
    displayedHeight = containerHeight
    displayedWidth = containerHeight * imageAspect
  }

  // Calculate minimum scale: either 1x (natural size) or scale needed to reach 100px
  const minDimension = Math.min(displayedWidth, displayedHeight)
  const scaleFor100px = 100 / minDimension

  // Return the minimum of 1x and the scale needed for 100px
  return Math.min(1, scaleFor100px)
}

const zoomIn = () => {
  imageScale.value = Math.min(imageScale.value + 0.25, 5) // Maximum 500% (5x)
}

const zoomOut = () => {
  const minScale = getMinZoomScale()
  const newScale = Math.max(imageScale.value - 0.25, minScale)
  imageScale.value = newScale
  // Reset translation if zoomed out to minimum
  if (newScale <= minScale) {
    imageTranslateX.value = 0
    imageTranslateY.value = 0
  }
}

const rotateImage = () => {
  // Rotate 90 degrees each click, continuously incrementing to maintain forward rotation animation
  imageRotation.value = imageRotation.value + 90
}

const resetImageTransform = () => {
  // Clear any pending rotation reset timeout
  if (imageRotationResetTimeout.value) {
    clearTimeout(imageRotationResetTimeout.value)
    imageRotationResetTimeout.value = null
  }
  // Reset scale, rotation, and position
  imageScale.value = 1
  imageRotation.value = 0
  imageTranslateX.value = 0
  imageTranslateY.value = 0
}

const handleImageWheel = (e: WheelEvent) => {
  e.preventDefault()
  if (e.deltaY < 0) {
    zoomIn()
  } else {
    zoomOut()
  }
}

// Helper to check if image can be dragged (is zoomed beyond minimum)
const canDragImage = computed(() => {
  const minScale = getMinZoomScale()
  return imageScale.value > minScale
})

// Image pan/drag handlers
const handleImageMouseDown = (e: MouseEvent) => {
  if (!canDragImage.value) return // Only allow dragging when zoomed beyond minimum
  e.preventDefault()
  isDragging.value = true
  dragStartX.value = e.clientX
  dragStartY.value = e.clientY
  imageTranslateXStart.value = imageTranslateX.value
  imageTranslateYStart.value = imageTranslateY.value
}

const handleImageMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !canDragImage.value) return
  e.preventDefault()

  const deltaX = e.clientX - dragStartX.value
  const deltaY = e.clientY - dragStartY.value

  const newTranslateX = imageTranslateXStart.value + deltaX
  const newTranslateY = imageTranslateYStart.value + deltaY

  // Calculate bounds based on image and container dimensions
  const bounds = calculateImageBounds()
  imageTranslateX.value = Math.max(Math.min(newTranslateX, bounds.maxX), bounds.minX)
  imageTranslateY.value = Math.max(Math.min(newTranslateY, bounds.maxY), bounds.minY)
}

const handleImageMouseUp = () => {
  isDragging.value = false
}

const handleImageTouchStart = (e: TouchEvent) => {
  if (!canDragImage.value || e.touches.length !== 1 || !e.touches[0]) return
  e.preventDefault()
  isDragging.value = true
  dragStartX.value = e.touches[0].clientX
  dragStartY.value = e.touches[0].clientY
  imageTranslateXStart.value = imageTranslateX.value
  imageTranslateYStart.value = imageTranslateY.value
}

const handleImageTouchMove = (e: TouchEvent) => {
  if (!isDragging.value || !canDragImage.value || e.touches.length !== 1 || !e.touches[0]) return
  e.preventDefault()

  const deltaX = e.touches[0].clientX - dragStartX.value
  const deltaY = e.touches[0].clientY - dragStartY.value

  const newTranslateX = imageTranslateXStart.value + deltaX
  const newTranslateY = imageTranslateYStart.value + deltaY

  // Calculate bounds based on image and container dimensions
  const bounds = calculateImageBounds()
  imageTranslateX.value = Math.max(Math.min(newTranslateX, bounds.maxX), bounds.minX)
  imageTranslateY.value = Math.max(Math.min(newTranslateY, bounds.maxY), bounds.minY)
}

const handleImageTouchEnd = () => {
  isDragging.value = false
}

const calculateImageBounds = () => {
  if (!lightboxImageRef.value) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0 }
  }

  const img = lightboxImageRef.value
  const container = img.parentElement
  if (!container) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0 }
  }

  // Get natural image dimensions
  const naturalWidth = img.naturalWidth || 0
  const naturalHeight = img.naturalHeight || 0

  if (naturalWidth === 0 || naturalHeight === 0) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0 }
  }

  // Get displayed dimensions (object-contain maintains aspect ratio)
  const containerWidth = container.clientWidth
  const containerHeight = container.clientHeight

  // Calculate displayed size maintaining aspect ratio
  const containerAspect = containerWidth / containerHeight
  const imageAspect = naturalWidth / naturalHeight

  let displayedWidth: number
  let displayedHeight: number

  if (imageAspect > containerAspect) {
    // Image is wider - fit to width
    displayedWidth = containerWidth
    displayedHeight = containerWidth / imageAspect
  } else {
    // Image is taller - fit to height
    displayedHeight = containerHeight
    displayedWidth = containerHeight * imageAspect
  }

  // Calculate scaled dimensions
  const scaledWidth = displayedWidth * imageScale.value
  const scaledHeight = displayedHeight * imageScale.value

  // Calculate bounds (how far we can drag)
  // When zoomed, we can drag until edges align
  const maxTranslateX = Math.max(0, (scaledWidth - containerWidth) / 2)
  const maxTranslateY = Math.max(0, (scaledHeight - containerHeight) / 2)

  return {
    minX: -maxTranslateX,
    maxX: maxTranslateX,
    minY: -maxTranslateY,
    maxY: maxTranslateY
  }
}

// Video controls
const handleVideoLoadedMetadata = () => {
  if (lightboxVideoRef.value) {
    videoDuration.value = lightboxVideoRef.value.duration || 0
    // Apply persisted mute state when video metadata loads
    lightboxVideoRef.value.muted = isVideoMuted.value
    // Seek to first frame to show it when paused (instead of black screen)
    if (!globalVideoPlayingState.value) {
      lightboxVideoRef.value.currentTime = 0.1
    }
  }
}

const handleVideoLoadedData = () => {
  // When video data is loaded and paused, ensure we show the current frame
  if (lightboxVideoRef.value && !globalVideoPlayingState.value) {
    // If currentTime is 0, seek to a small value to show first frame
    if (lightboxVideoRef.value.currentTime === 0) {
      lightboxVideoRef.value.currentTime = 0.1
    }
  }
}

const updateVideoTime = () => {
  if (lightboxVideoRef.value) {
    videoCurrentTime.value = lightboxVideoRef.value.currentTime || 0
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

const handleVideoPlay = () => {
  isVideoPlaying.value = true
  globalVideoPlayingState.value = true
  startVideoUpdateTimer()
  // Show visual indicator
  showPlayPauseIndicatorTemporary()
}

const handleVideoPause = () => {
  isVideoPlaying.value = false
  globalVideoPlayingState.value = false
  stopVideoUpdateTimer()
  // Ensure current frame is visible when paused
  if (lightboxVideoRef.value) {
    // Force a small update to ensure the frame is rendered
    const currentTime = lightboxVideoRef.value.currentTime
    if (currentTime > 0) {
      // Slight seek to ensure frame is displayed
      lightboxVideoRef.value.currentTime = currentTime
    }
  }
  // Show visual indicator
  showPlayPauseIndicatorTemporary()
}

const toggleVideoPlayPause = () => {
  if (!lightboxVideoRef.value) return
  if (lightboxVideoRef.value.paused) {
    lightboxVideoRef.value.play().catch(() => {})
  } else {
    lightboxVideoRef.value.pause()
  }
}

const handleVideoSeek = (e: Event) => {
  const target = e.target as HTMLInputElement
  const percentage = parseFloat(target.value)
  if (lightboxVideoRef.value && videoDuration.value > 0) {
    lightboxVideoRef.value.currentTime = (percentage / 100) * videoDuration.value
  }
}

const toggleMute = () => {
  if (lightboxVideoRef.value) {
    // Update global mute state
    isVideoMuted.value = !isVideoMuted.value
    // Apply to current video
    lightboxVideoRef.value.muted = isVideoMuted.value
  }
}

const handleVideoEnded = () => {
  isVideoPlaying.value = false
  globalVideoPlayingState.value = false
  stopVideoUpdateTimer()
}

const startVideoUpdateTimer = () => {
  stopVideoUpdateTimer()
  videoUpdateTimer = setInterval(() => {
    if (lightboxVideoRef.value) {
      videoCurrentTime.value = lightboxVideoRef.value.currentTime || 0
    }
  }, 100)
}

const stopVideoUpdateTimer = () => {
  if (videoUpdateTimer) {
    clearInterval(videoUpdateTimer)
    videoUpdateTimer = null
  }
}

const handleControlsMouseEnter = () => {
  isMouseOverControls.value = true
  if (mouseMoveTimer) {
    clearTimeout(mouseMoveTimer)
    mouseMoveTimer = null
  }
}

const handleControlsMouseLeave = () => {
  isMouseOverControls.value = false
  if (!isMouseOverControls.value) {
    mouseMoveTimer = setTimeout(() => {
      showVideoControls.value = false
      mouseMoveTimer = null
    }, mouseTimeoutDelay)
  }
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Seek indicator functions
const showSeekIndicatorTemporary = (amount: number, isNewSeek: boolean = true, shouldAccumulate: boolean = true) => {
  // If direction changed (positive to negative or vice versa), reset
  const directionChanged =
    showSeekIndicator.value &&
    ((accumulatedSeekAmount.value > 0 && amount < 0) || (accumulatedSeekAmount.value < 0 && amount > 0))

  // If indicator is already showing and it's a continuous seek in same direction, accumulate
  if (showSeekIndicator.value && !isNewSeek && shouldAccumulate && !directionChanged) {
    accumulatedSeekAmount.value += amount
    seekIndicatorAmount.value = accumulatedSeekAmount.value
  } else {
    // New seek or direction changed, reset accumulated amount
    accumulatedSeekAmount.value = amount
    seekIndicatorAmount.value = amount
  }

  showSeekIndicator.value = true

  // Clear existing timer
  if (seekIndicatorTimer) {
    clearTimeout(seekIndicatorTimer)
  }

  // Hide after 1.5 seconds
  seekIndicatorTimer = setTimeout(() => {
    showSeekIndicator.value = false
    accumulatedSeekAmount.value = 0
    seekIndicatorTimer = null
  }, 1500)
}

const seekVideo = (amount: number) => {
  if (lightboxVideoRef.value && isVideoPlaying.value) {
    const currentTime = lightboxVideoRef.value.currentTime
    const duration = videoDuration.value

    // Check if we're near the boundaries (less than 10 seconds remaining)
    const remainingTime = duration - currentTime
    const timeFromStart = currentTime

    // Determine if we should accumulate based on remaining time
    let shouldAccumulate = true
    if (amount > 0 && remainingTime < 10) {
      // Forward seek but less than 10s remaining - don't accumulate
      shouldAccumulate = false
    } else if (amount < 0 && timeFromStart < 10) {
      // Backward seek but less than 10s from start - don't accumulate
      shouldAccumulate = false
    }

    const newTime = Math.max(0, Math.min(duration, currentTime + amount))
    lightboxVideoRef.value.currentTime = newTime
    videoCurrentTime.value = newTime
    // Show seek indicator (pass false if indicator is already showing to accumulate)
    showSeekIndicatorTemporary(amount, !showSeekIndicator.value, shouldAccumulate)
  }
}

// Keyboard navigation
const handleKeyDown = (e: KeyboardEvent) => {
  if (!props.modelValue) return

  if (e.key === 'Escape') {
    handleClose()
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    if (currentAsset.value?.type === 'video' && isVideoPlaying.value && lightboxVideoRef.value) {
      seekVideo(-10)
    } else if (currentIndex.value > 0) {
      goToPrevious()
    }
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    if (currentAsset.value?.type === 'video' && isVideoPlaying.value && lightboxVideoRef.value) {
      seekVideo(10)
    } else if (currentIndex.value < props.assets.length - 1) {
      goToNext()
    }
  } else if (e.key === ' ' || e.key === 'Spacebar') {
    e.preventDefault()
    if (currentAsset.value?.type === 'video') {
      toggleVideoPlayPause()
    }
  }
}

// Watch for modelValue changes to initialize
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      currentIndex.value = props.initialIndex
      imageScale.value = 1
      imageRotation.value = 0
      imageTranslateX.value = 0
      imageTranslateY.value = 0
      if (currentAsset.value?.type === 'video') {
        nextTick(() => {
          if (lightboxVideoRef.value) {
            lightboxVideoRef.value.currentTime = 0
            // Apply global mute state
            lightboxVideoRef.value.muted = isVideoMuted.value
            // Apply global play state (default to playing when lightbox opens)
            globalVideoPlayingState.value = true
            lightboxVideoRef.value.play().catch(() => {})
            isVideoPlaying.value = true
            startVideoUpdateTimer()
          }
        })
      }
      document.body.style.overflow = 'hidden'
      // Update padding and scroll to current thumbnail
      nextTick(() => {
        updateThumbnailPadding()
        // Wait for padding to be applied before scrolling
        setTimeout(() => {
          scrollToThumbnail(currentIndex.value)
        }, 50)
      })
    } else {
      if (lightboxVideoRef.value) {
        lightboxVideoRef.value.pause()
        stopVideoUpdateTimer()
      }
      document.body.style.overflow = ''
    }
  }
)

// Watch for initialIndex changes
watch(
  () => props.initialIndex,
  (newIndex) => {
    if (props.modelValue) {
      currentIndex.value = newIndex
      imageScale.value = 1
      imageRotation.value = 0
      imageTranslateX.value = 0
      imageTranslateY.value = 0
      if (currentAsset.value?.type === 'video') {
        nextTick(() => {
          if (lightboxVideoRef.value) {
            lightboxVideoRef.value.currentTime = 0
            // Apply global mute state
            lightboxVideoRef.value.muted = isVideoMuted.value
            // Apply global play state
            if (globalVideoPlayingState.value) {
              lightboxVideoRef.value.play().catch(() => {})
              isVideoPlaying.value = true
              startVideoUpdateTimer()
            } else {
              isVideoPlaying.value = false
            }
          }
        })
      }
    }
  }
)

// Watch for currentIndex changes to automatically center the selected thumbnail
watch(
  () => currentIndex.value,
  () => {
    if (props.modelValue && thumbnailContainerRef.value) {
      // Wait for DOM update and ensure padding is calculated
      nextTick(() => {
        updateThumbnailPadding()
        // Small delay to ensure padding is applied and DOM is updated
        setTimeout(() => {
          scrollToThumbnail(currentIndex.value)
        }, 50)
      })
    }
  }
)

// Event handlers for cleanup
let handleMouseMove: (() => void) | null = null
let handleResize: (() => void) | null = null

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  // Listen for fullscreen changes
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('msfullscreenchange', handleFullscreenChange)
  // Show video controls on mouse move
  handleMouseMove = () => {
    if (currentAsset.value?.type === 'video') {
      showVideoControls.value = true
      if (mouseMoveTimer) {
        clearTimeout(mouseMoveTimer)
      }
      if (!isMouseOverControls.value) {
        mouseMoveTimer = setTimeout(() => {
          showVideoControls.value = false
          mouseMoveTimer = null
        }, mouseTimeoutDelay)
      }
    }
  }
  window.addEventListener('mousemove', handleMouseMove)
  // Update thumbnail padding on resize
  handleResize = () => {
    updateThumbnailPadding()
    // Re-center the current thumbnail after resize
    if (props.modelValue) {
      setTimeout(() => {
        scrollToThumbnail(currentIndex.value)
      }, 50)
    }
  }
  window.addEventListener('resize', handleResize)
  // Initial padding update
  nextTick(() => {
    updateThumbnailPadding()
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  if (handleMouseMove) {
    window.removeEventListener('mousemove', handleMouseMove)
  }
  if (handleResize) {
    window.removeEventListener('resize', handleResize)
  }
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('msfullscreenchange', handleFullscreenChange)
  // Exit fullscreen on unmount
  if (isFullscreen.value) {
    exitFullscreen()
  }
  stopVideoUpdateTimer()
  if (mouseMoveTimer) {
    clearTimeout(mouseMoveTimer)
  }
  if (seekIndicatorTimer) {
    clearTimeout(seekIndicatorTimer)
    seekIndicatorTimer = null
  }
  if (playPauseIndicatorTimer) {
    clearTimeout(playPauseIndicatorTimer)
    playPauseIndicatorTimer = null
  }
})
</script>

<style scoped>
/* Ensure tooltips appear above lightbox content */
:deep([data-headlessui-portal]) {
  z-index: 9999 !important;
}

.video-seekbar {
  width: 100%;
  height: 100%;
}

.video-seekbar::-webkit-slider-thumb {
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

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
