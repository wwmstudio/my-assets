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
