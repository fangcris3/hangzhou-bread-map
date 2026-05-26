import type { Store } from './types'
import { DEMO_STORES } from './stores'

const KEY = 'hzroadbook_stores'

export function loadStores(_isAdmin = false): Store[] {
  const raw = localStorage.getItem(KEY)
  if (!raw) {
    saveStores(DEMO_STORES)
    return DEMO_STORES
  }
  try {
    return JSON.parse(raw) as Store[]
  } catch {
    return DEMO_STORES
  }
}

export function saveStores(stores: Store[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(stores))
  } catch {
    console.warn('localStorage quota exceeded — data not persisted locally')
  }
  // Dev-server middleware writes to src/data/stores.json so the change is committable.
  // Tree-shaken out of production builds.
  if (import.meta.env.DEV) {
    fetch('/api/save-stores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stores),
    }).catch(() => {})
  }
}

export function exportJSON(stores: Store[]): void {
  download(
    new Blob([JSON.stringify(stores, null, 2)], { type: 'application/json' }),
    'hzroadbook.json',
  )
}

export function exportCSV(stores: Store[]): void {
  const header = ['Map Number', 'Name', 'Address', 'Neighborhood', 'Crust', 'Softness', 'Flavor', 'Review']
  const rows = stores
    .slice()
    .sort((a, b) => a.mapNumber - b.mapNumber)
    .map(s => [
      s.mapNumber,
      s.name,
      s.address,
      s.neighborhood,
      s.ratings.crust,
      s.ratings.softness,
      s.ratings.flavor,
      s.shortReview,
    ])
  const csv = [header, ...rows]
    .map(row => row.map(cell => {
      const str = String(cell ?? '')
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
    }).join(','))
    .join('\n')
  download(new Blob([csv], { type: 'text/csv;charset=utf-8' }), 'coldbrewmap.csv')
}

function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
