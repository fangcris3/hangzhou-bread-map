export interface Store {
  id: string
  name: string
  address: string
  neighborhood: string
  shortReview: string
  ratings: {
    crust: number
    softness: number
    flavor: number
  }
  photo: string
  mapNumber: number
  lat?: number
  lng?: number
  isChain?: boolean
  region?: 'north' | 'south'
}
