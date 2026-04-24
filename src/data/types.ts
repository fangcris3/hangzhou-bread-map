export interface Store {
  id: string
  name: string
  address: string
  neighborhood: string
  shortReview: string
  ratings: {
    bitter: number
    sweetness: number
    power: number
  }
  photo: string
  mapNumber: number
  mapCoords?: { x: number; y: number }
  isChain?: boolean
  region?: 'north' | 'south'
}
