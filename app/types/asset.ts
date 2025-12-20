export type AssetType = 'image' | 'video'

export interface Asset {
  id: string
  type: AssetType
  title: string
  description?: string
  url: string
  thumbnail?: string
  width?: number
  height?: number
  duration?: number // For videos in seconds
  size?: number // File size in bytes
  format?: string // e.g., 'jpg', 'png', 'mp4', 'webm'
  createdAt: string
  updatedAt: string
  tags?: string[]
}
