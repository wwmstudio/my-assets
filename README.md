# My Assets

A modern asset management application built with Nuxt 3, featuring image and video galleries with advanced viewing capabilities.

## Features

- **Carousel View**: Full-screen carousel with autoplay for images and videos
- **Grid View**: Responsive grid layout with keyboard navigation
- **Bento View**: Pinterest-style masonry layout with dynamic aspect ratios
- **Lightbox**: Advanced lightbox viewer with:
  - Image zoom (up to 500%) and rotation
  - Image panning when zoomed
  - Video playback controls
  - Thumbnail navigation
  - Fullscreen mode
  - Keyboard shortcuts
- **Smooth Page Transitions**: Animated transitions between pages
- **Entrance Animations**: Staggered tile animations on page load
- **Accessibility**: Full keyboard navigation and ARIA labels

## Tech Stack

- **Framework**: Nuxt 3
- **UI Library**: Nuxt UI
- **Image Optimization**: Nuxt Image
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd my-assets
```

2. Install dependencies:

```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Build

Build for production:

```bash
pnpm build
```

Preview production build:

```bash
pnpm preview
```

## Project Structure

```
app/
├── components/     # Vue components (Lightbox, TopNavigation, etc.)
├── pages/         # Application pages (index, grid, bento)
├── composables/   # Vue composables (useAssets)
└── types/         # TypeScript type definitions
```

## Usage

### Navigation

- **Home** (`/`): Full-screen carousel view with autoplay
- **Grid** (`/grid`): Grid layout of all assets
- **Bento** (`/bento`): Masonry layout with dynamic aspect ratios

### Keyboard Shortcuts

#### Lightbox

- `Escape`: Close lightbox
- `Arrow Left/Right`: Navigate between assets or seek video
- `Space`: Play/pause video
- `+/-` or `Mouse Wheel`: Zoom in/out (images)
- `R`: Rotate image
- `0`: Reset image transform

#### Grid/Bento Pages

- `Tab`: Navigate between tiles
- `Enter/Space`: Open asset in lightbox

## License

MIT
