import type { Asset } from '~/types/asset'

export const useAssets = () => {
  const assets = useState<Asset[]>('assets', () => [
    // Image assets
    {
      id: '1',
      type: 'image',
      title: 'Mountain Landscape',
      description: 'Beautiful mountain range at sunset',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80',
      width: 1920,
      height: 1080,
      size: 2456789,
      format: 'jpg',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      tags: ['nature', 'mountains', 'landscape']
    },
    {
      id: '2',
      type: 'image',
      title: 'Ocean Waves',
      description: 'Calm ocean waves on a beach',
      url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200&q=80',
      width: 1920,
      height: 1080,
      size: 1892345,
      format: 'jpg',
      createdAt: '2024-01-16T14:20:00Z',
      updatedAt: '2024-01-16T14:20:00Z',
      tags: ['ocean', 'beach', 'water']
    },
    {
      id: '3',
      type: 'image',
      title: 'Forest Path',
      description: 'Serene forest trail through the woods',
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&q=80',
      width: 1920,
      height: 1080,
      size: 2123456,
      format: 'jpg',
      createdAt: '2024-01-17T09:15:00Z',
      updatedAt: '2024-01-17T09:15:00Z',
      tags: ['forest', 'nature', 'path']
    },
    {
      id: '4',
      type: 'image',
      title: 'Sunset Over Mountains',
      description: 'Stunning sunset view over mountain peaks',
      url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200&q=80',
      width: 1920,
      height: 1080,
      size: 1987654,
      format: 'jpg',
      createdAt: '2024-01-18T18:45:00Z',
      updatedAt: '2024-01-18T18:45:00Z',
      tags: ['sunset', 'mountains', 'sky']
    },
    {
      id: '5',
      type: 'image',
      title: 'Desert Landscape',
      description: 'Vast desert with sand dunes',
      url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=200&q=80',
      width: 1920,
      height: 1080,
      size: 1765432,
      format: 'jpg',
      createdAt: '2024-01-19T11:00:00Z',
      updatedAt: '2024-01-19T11:00:00Z',
      tags: ['desert', 'sand', 'landscape']
    },
    // Video assets
    {
      id: '6',
      type: 'video',
      title: 'Nature Documentary',
      description: 'Beautiful nature scenes compilation',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80',
      width: 1920,
      height: 1080,
      duration: 596,
      size: 45678901,
      format: 'mp4',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z',
      tags: ['nature', 'documentary', 'wildlife']
    },
    {
      id: '7',
      type: 'video',
      title: 'Ocean Waves Video',
      description: 'Relaxing ocean waves footage',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200&q=80',
      width: 1920,
      height: 1080,
      duration: 653,
      size: 52345678,
      format: 'mp4',
      createdAt: '2024-01-21T15:30:00Z',
      updatedAt: '2024-01-21T15:30:00Z',
      tags: ['ocean', 'waves', 'relaxing']
    },
    {
      id: '8',
      type: 'video',
      title: 'Mountain Time-lapse',
      description: 'Time-lapse of mountain scenery',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200&q=80',
      width: 1920,
      height: 1080,
      duration: 15,
      size: 3456789,
      format: 'mp4',
      createdAt: '2024-01-22T08:20:00Z',
      updatedAt: '2024-01-22T08:20:00Z',
      tags: ['mountains', 'timelapse', 'nature']
    },
    // Portrait images (tall aspect ratios)
    {
      id: '9',
      type: 'image',
      title: 'Portrait Photography',
      description: 'Beautiful portrait in natural light',
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1080&h=1350&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
      width: 1080,
      height: 1350,
      size: 1234567,
      format: 'jpg',
      createdAt: '2024-01-23T12:00:00Z',
      updatedAt: '2024-01-23T12:00:00Z',
      tags: ['portrait', 'people', 'photography']
    },
    {
      id: '10',
      type: 'image',
      title: 'Tall Building',
      description: 'Modern skyscraper reaching the clouds',
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=1200&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=80',
      width: 800,
      height: 1200,
      size: 987654,
      format: 'jpg',
      createdAt: '2024-01-24T09:30:00Z',
      updatedAt: '2024-01-24T09:30:00Z',
      tags: ['architecture', 'building', 'urban']
    },
    {
      id: '11',
      type: 'image',
      title: 'Vertical Waterfall',
      description: 'Tall cascading waterfall in the forest',
      url: 'https://images.unsplash.com/photo-1512273222628-4daea6e55abb?w=900&h=1600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1512273222628-4daea6e55abb?w=200&q=80',
      width: 900,
      height: 1600,
      size: 1456789,
      format: 'jpg',
      createdAt: '2024-01-25T14:15:00Z',
      updatedAt: '2024-01-25T14:15:00Z',
      tags: ['waterfall', 'nature', 'vertical']
    },
    // Square images
    {
      id: '12',
      type: 'image',
      title: 'Square Garden',
      description: 'Perfectly square garden layout',
      url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=1200&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&q=80',
      width: 1200,
      height: 1200,
      size: 1123456,
      format: 'jpg',
      createdAt: '2024-01-26T10:00:00Z',
      updatedAt: '2024-01-26T10:00:00Z',
      tags: ['garden', 'square', 'plants']
    },
    {
      id: '13',
      type: 'image',
      title: 'Square Artwork',
      description: 'Abstract square art piece',
      url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1000&h=1000&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&q=80',
      width: 1000,
      height: 1000,
      size: 876543,
      format: 'jpg',
      createdAt: '2024-01-27T11:20:00Z',
      updatedAt: '2024-01-27T11:20:00Z',
      tags: ['art', 'abstract', 'square']
    },
    // Ultra-wide landscape images
    {
      id: '14',
      type: 'image',
      title: 'Panoramic View',
      description: 'Ultra-wide panoramic mountain view',
      url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=2560&h=1080&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=200&q=80',
      width: 2560,
      height: 1080,
      size: 2345678,
      format: 'jpg',
      createdAt: '2024-01-28T16:45:00Z',
      updatedAt: '2024-01-28T16:45:00Z',
      tags: ['panoramic', 'wide', 'landscape']
    },
    {
      id: '15',
      type: 'image',
      title: 'Wide Beach',
      description: 'Expansive beach coastline view',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=2400&h=900&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80',
      width: 2400,
      height: 900,
      size: 1987654,
      format: 'jpg',
      createdAt: '2024-01-29T08:30:00Z',
      updatedAt: '2024-01-29T08:30:00Z',
      tags: ['beach', 'coastline', 'wide']
    },
    // Small images
    {
      id: '16',
      type: 'image',
      title: 'Small Flower',
      description: 'Tiny flower close-up',
      url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200&q=80',
      width: 800,
      height: 600,
      size: 456789,
      format: 'jpg',
      createdAt: '2024-01-30T13:00:00Z',
      updatedAt: '2024-01-30T13:00:00Z',
      tags: ['flower', 'macro', 'small']
    },
    {
      id: '17',
      type: 'image',
      title: 'Compact City',
      description: 'Small city street scene',
      url: 'https://images.unsplash.com/photo-1449824913935-9a10bd0e0871?w=1024&h=768&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=200&q=80',
      width: 1024,
      height: 768,
      size: 567890,
      format: 'jpg',
      createdAt: '2024-01-31T15:20:00Z',
      updatedAt: '2024-01-31T15:20:00Z',
      tags: ['city', 'street', 'urban']
    },
    // Large/4K images
    {
      id: '18',
      type: 'image',
      title: '4K Landscape',
      description: 'Ultra high resolution landscape',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=3840&h=2160&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80',
      width: 3840,
      height: 2160,
      size: 5678901,
      format: 'jpg',
      createdAt: '2024-02-01T10:00:00Z',
      updatedAt: '2024-02-01T10:00:00Z',
      tags: ['4k', 'high-res', 'landscape']
    },
    {
      id: '19',
      type: 'image',
      title: 'Large Portrait',
      description: 'High resolution portrait image',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=2160&h=2880&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
      width: 2160,
      height: 2880,
      size: 3456789,
      format: 'jpg',
      createdAt: '2024-02-02T11:30:00Z',
      updatedAt: '2024-02-02T11:30:00Z',
      tags: ['portrait', 'large', 'people']
    },
    // Video assets with different aspect ratios
    {
      id: '20',
      type: 'video',
      title: 'Portrait Video',
      description: 'Vertical format video content',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
      width: 1080,
      height: 1920,
      duration: 45,
      size: 12345678,
      format: 'mp4',
      createdAt: '2024-02-03T09:00:00Z',
      updatedAt: '2024-02-03T09:00:00Z',
      tags: ['video', 'portrait', 'vertical']
    },
    {
      id: '21',
      type: 'video',
      title: 'Square Video',
      description: 'Square format video content',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&q=80',
      width: 1080,
      height: 1080,
      duration: 60,
      size: 9876543,
      format: 'mp4',
      createdAt: '2024-02-04T14:15:00Z',
      updatedAt: '2024-02-04T14:15:00Z',
      tags: ['video', 'square', 'social']
    },
    {
      id: '22',
      type: 'video',
      title: 'Wide Screen Video',
      description: 'Ultra-wide cinematic video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=200&q=80',
      width: 2560,
      height: 1080,
      duration: 120,
      size: 45678901,
      format: 'mp4',
      createdAt: '2024-02-05T16:30:00Z',
      updatedAt: '2024-02-05T16:30:00Z',
      tags: ['video', 'wide', 'cinematic']
    },
    {
      id: '23',
      type: 'video',
      title: 'Short Clip',
      description: 'Quick 10 second video clip',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80',
      width: 1920,
      height: 1080,
      duration: 10,
      size: 2345678,
      format: 'mp4',
      createdAt: '2024-02-06T12:00:00Z',
      updatedAt: '2024-02-06T12:00:00Z',
      tags: ['video', 'short', 'clip']
    },
    // More varied aspect ratios
    {
      id: '24',
      type: 'image',
      title: 'Wide Ratio Image',
      description: '21:9 ultra-wide format',
      url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=2100&h=900&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=200&q=80',
      width: 2100,
      height: 900,
      size: 1876543,
      format: 'jpg',
      createdAt: '2024-02-07T10:45:00Z',
      updatedAt: '2024-02-07T10:45:00Z',
      tags: ['wide', 'ultra-wide', 'landscape']
    },
    {
      id: '25',
      type: 'image',
      title: 'Tall Narrow Image',
      description: 'Very tall and narrow format',
      url: 'https://images.unsplash.com/photo-1512273222628-4daea6e55abb?w=600&h=1800&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1512273222628-4daea6e55abb?w=200&q=80',
      width: 600,
      height: 1800,
      size: 1234567,
      format: 'jpg',
      createdAt: '2024-02-08T13:20:00Z',
      updatedAt: '2024-02-08T13:20:00Z',
      tags: ['tall', 'narrow', 'vertical']
    },
    {
      id: '26',
      type: 'image',
      title: 'Medium Landscape',
      description: 'Medium sized landscape photo',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80',
      width: 1600,
      height: 900,
      size: 1456789,
      format: 'jpg',
      createdAt: '2024-02-09T09:15:00Z',
      updatedAt: '2024-02-09T09:15:00Z',
      tags: ['medium', 'landscape', 'nature']
    },
    {
      id: '27',
      type: 'image',
      title: 'Small Square',
      description: 'Small square format image',
      url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&q=80',
      width: 600,
      height: 600,
      size: 345678,
      format: 'jpg',
      createdAt: '2024-02-10T11:00:00Z',
      updatedAt: '2024-02-10T11:00:00Z',
      tags: ['small', 'square', 'compact']
    },
    {
      id: '28',
      type: 'video',
      title: 'Long Documentary',
      description: 'Extended documentary video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80',
      width: 1920,
      height: 1080,
      duration: 888,
      size: 123456789,
      format: 'mp4',
      createdAt: '2024-02-11T15:30:00Z',
      updatedAt: '2024-02-11T15:30:00Z',
      tags: ['documentary', 'long', 'video']
    },
    {
      id: '29',
      type: 'image',
      title: 'Aspect Ratio 4:3',
      description: 'Classic 4:3 aspect ratio image',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=1200&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80',
      width: 1600,
      height: 1200,
      size: 1567890,
      format: 'jpg',
      createdAt: '2024-02-12T10:20:00Z',
      updatedAt: '2024-02-12T10:20:00Z',
      tags: ['4:3', 'classic', 'landscape']
    },
    {
      id: '30',
      type: 'image',
      title: 'Aspect Ratio 3:4',
      description: 'Portrait 3:4 aspect ratio',
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&h=1200&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
      width: 900,
      height: 1200,
      size: 1123456,
      format: 'jpg',
      createdAt: '2024-02-13T14:00:00Z',
      updatedAt: '2024-02-13T14:00:00Z',
      tags: ['3:4', 'portrait', 'vertical']
    }
  ])

  const getAssetById = (id: string): Asset | undefined => {
    return assets.value.find(asset => asset.id === id)
  }

  const getAssetsByType = (type: Asset['type']): Asset[] => {
    return assets.value.filter(asset => asset.type === type)
  }

  const getImages = (): Asset[] => {
    return getAssetsByType('image')
  }

  const getVideos = (): Asset[] => {
    return getAssetsByType('video')
  }

  const searchAssets = (query: string): Asset[] => {
    const lowerQuery = query.toLowerCase()
    return assets.value.filter(
      asset =>
        asset.title.toLowerCase().includes(lowerQuery) ||
        asset.description?.toLowerCase().includes(lowerQuery) ||
        asset.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  const addAsset = (asset: Asset): void => {
    assets.value.push(asset)
  }

  const updateAsset = (id: string, updates: Partial<Asset>): void => {
    const index = assets.value.findIndex(asset => asset.id === id)
    if (index !== -1) {
      assets.value[index] = { ...assets.value[index], ...updates, updatedAt: new Date().toISOString() } as Asset
    }
  }

  const deleteAsset = (id: string): void => {
    const index = assets.value.findIndex(asset => asset.id === id)
    if (index !== -1) {
      assets.value.splice(index, 1)
    }
  }

  const fetchAssets = async (): Promise<void> => {
    // TODO: Replace with actual API call
    // const response = await $fetch('/api/assets')
    // assets.value = response
  }

  return {
    assets: readonly(assets),
    getAssetById,
    getAssetsByType,
    getImages,
    getVideos,
    searchAssets,
    addAsset,
    updateAsset,
    deleteAsset,
    fetchAssets
  }
}
