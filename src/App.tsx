import { useRef, useState } from 'react'
import { loadStores, saveStores } from './data/storage'
import { SITE_CONFIG } from './data/config'
import type { Store } from './data/types'
import CoverPage from './components/CoverPage/CoverPage'
import CardA from './components/CardVariants/CardA'
import AdminPanel from './components/AdminPanel/AdminPanel'
import Demo from './components/Demo/Demo'
import Book, { type BookHandle, type BookPage, type BookBackdrop } from './components/Book/Book'

const params = new URLSearchParams(window.location.search)
const CARDS_PER_PAGE = 6
const backdropParam = params.get('backdrop')
const BACKDROP: BookBackdrop = backdropParam === 'desk' || backdropParam === 'cream' ? backdropParam : 'dark'

export default function App() {
  if (params.get('demo') === 'true') return <Demo />

  const isAdmin = params.get('admin') === 'true'

  const [stores, setStores] = useState<Store[]>(() => loadStores(isAdmin))
  const [editingStore, setEditingStore] = useState<Store | null>(null)
  const [placingStore, setPlacingStore] = useState<Store | null>(null)
  const bookRef = useRef<BookHandle>(null)

  function handleSave(updated: Store) {
    const exists = stores.some(s => s.id === updated.id)
    const next = exists
      ? stores.map(s => s.id === updated.id ? updated : s)
      : [...stores, updated]
    setStores(next)
    saveStores(next)
    setEditingStore(null)
  }

  function handleDelete(id: string) {
    const next = stores.filter(s => s.id !== id)
    setStores(next)
    saveStores(next)
    setEditingStore(null)
  }

  function handleStartPlace(store: Store) {
    setPlacingStore(store)
    setEditingStore(null)
    const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
    if (isDesktop && bookRef.current) {
      bookRef.current.goToPage(store.region === 'south' ? 'map-south' : 'map-north')
    } else {
      document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  function handlePlace(id: string, coords: { x: number; y: number }) {
    const next = stores.map(s => s.id === id ? { ...s, mapCoords: coords } : s)
    setStores(next)
    saveStores(next)
    setPlacingStore(null)
  }

  function handleClearPin(id: string) {
    const next = stores.map(s => {
      if (s.id !== id) return s
      const { mapCoords: _, ...rest } = s
      return rest
    })
    setStores(next)
    saveStores(next)
    setPlacingStore(null)
  }

  function handleNew() {
    const nextMapNumber = stores.length > 0 ? Math.max(...stores.map(s => s.mapNumber)) + 1 : 1
    setEditingStore({
      id: crypto.randomUUID(),
      name: '',
      address: '',
      neighborhood: '',
      shortReview: '',
      ratings: { bitter: 3, sweetness: 3, power: 3 },
      photo: '',
      mapNumber: nextMapNumber,
    })
  }

  // Paginate stores for the book layout — sorted by map number
  const sortedStores = [...stores].sort((a, b) => a.mapNumber - b.mapNumber)
  const storePages: Store[][] = []
  for (let i = 0; i < sortedStores.length; i += CARDS_PER_PAGE) {
    storePages.push(sortedStores.slice(i, i + CARDS_PER_PAGE))
  }
  if (storePages.length === 0) storePages.push([])

  const fieldNotesPages: BookPage[] = storePages.map((pageStores, idx) => ({
    id: `field-notes-${idx}`,
    content: (
      <FieldNotesPage
        stores={pageStores}
        pageIndex={idx}
        pageCount={storePages.length}
        isAdmin={isAdmin}
        onCardClick={s => setEditingStore(s)}
      />
    ),
  }))

  const bookPages: BookPage[] = [
    { id: 'cover', content: <CoverPage /> },
    ...fieldNotesPages,
    {
      id: 'map-north',
      content: (
        <RegionalMapPage
          region="north"
          mapSrc="/map_north.png"
          stores={stores}
          isAdmin={isAdmin}
          placingStore={placingStore}
          onPlace={handlePlace}
          onStartPlace={handleStartPlace}
          onCancelPlace={() => setPlacingStore(null)}
        />
      ),
    },
    {
      id: 'map-south',
      content: (
        <RegionalMapPage
          region="south"
          mapSrc="/map_south.png"
          stores={stores}
          isAdmin={isAdmin}
          placingStore={placingStore}
          onPlace={handlePlace}
          onStartPlace={handleStartPlace}
          onCancelPlace={() => setPlacingStore(null)}
        />
      ),
    },
    { id: 'colophon', content: <ColophonPage /> },
  ]

  const adminToolbar = isAdmin ? (
    <button
      onClick={handleNew}
      className="font-mono text-[10px] tracking-widest uppercase bg-ink text-paper px-4 py-2 rounded-sm hover:bg-ink transition-colors shadow-md"
    >
      + New Entry
    </button>
  ) : null

  return (
    <>
      {/* Desktop: book layout */}
      <div className="hidden md:block">
        <Book ref={bookRef} pages={bookPages} adminToolbar={adminToolbar} backdrop={BACKDROP} />
      </div>

      {/* Mobile: vertical scroll layout */}
      <div className="md:hidden bg-paper bg-texture min-h-screen font-serif text-ink">
        <CoverPage />

        <section className="page-section px-6 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-5xl font-bold text-ink mb-1 leading-none">Field Notes</h2>
              <p className="font-mono text-xs text-sepia tracking-widest uppercase">— Ranked by Mushroom</p>
            </div>
            {isAdmin && (
              <button
                onClick={handleNew}
                className="font-mono text-[10px] tracking-widest uppercase bg-ink text-paper px-3 py-2 rounded-sm hover:bg-ink transition-colors"
              >
                + New
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 border-l border-t border-dashed border-ink/15">
            {sortedStores.map(store => (
              <div
                key={store.id}
                className={`border-r border-b border-dashed border-ink/15 ${isAdmin ? 'cursor-pointer hover:bg-ink/5' : ''}`}
                onClick={isAdmin ? () => setEditingStore(store) : undefined}
              >
                <CardA store={store} />
              </div>
            ))}
          </div>
        </section>

        <section id="map-section" className="page-section px-6 py-16">
          <h2 className="font-display text-5xl font-bold text-ink mb-1 leading-none">The Map</h2>
          <p className="font-mono text-xs text-sepia tracking-widest uppercase mb-6">— San Diego, CA</p>
          <p className="font-serif italic text-sm text-ink/60">View the full guide on desktop for the interactive regional maps.</p>
        </section>
      </div>

      {isAdmin && editingStore && (
        <AdminPanel
          store={editingStore}
          isNew={!stores.some(s => s.id === editingStore.id)}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setEditingStore(null)}
          onPlaceOnMap={handleStartPlace}
          onClearPin={handleClearPin}
          allStores={stores}
          onStoresChange={next => { setStores(next); saveStores(next) }}
        />
      )}
    </>
  )
}

function FieldNotesPage({
  stores,
  pageIndex,
  pageCount,
  isAdmin,
  onCardClick,
}: {
  stores: Store[]
  pageIndex: number
  pageCount: number
  isAdmin: boolean
  onCardClick: (s: Store) => void
}) {
  return (
    <div className="min-h-full w-full bg-paper bg-texture font-serif text-ink flex flex-col">
      {/* top banner */}
      <div className="bg-ink shrink-0 px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-display text-xl font-bold text-paper leading-none tracking-wide">San Diego Cold Brew Map</span>
          <span className="font-mono text-[9px] tracking-widest uppercase text-sepia">— by Mushroom</span>
        </div>
        {pageCount > 1 && (
          <span className="font-mono text-[9px] tracking-widest uppercase text-sepia">
            {pageIndex + 1} / {pageCount}
          </span>
        )}
      </div>

      {/* cards */}
      <div className="flex-1 px-6 py-5 flex flex-col justify-start min-h-0">
        <div className="grid grid-cols-3 border-l border-t border-dashed border-ink/15 flex-1">
          {stores.map(store => (
            <div
              key={store.id}
              className={`border-r border-b border-dashed border-ink/15 ${isAdmin ? 'cursor-pointer hover:bg-ink/5 transition-colors' : ''}`}
              onClick={isAdmin ? () => onCardClick(store) : undefined}
            >
              <CardA store={store} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RegionalMapPage({
  region,
  mapSrc,
  stores,
  isAdmin,
  placingStore,
  onPlace,
  onStartPlace,
  onCancelPlace,
}: {
  region: 'north' | 'south'
  mapSrc: string
  stores: Store[]
  isAdmin: boolean
  placingStore: Store | null
  onPlace: (id: string, coords: { x: number; y: number }) => void
  onStartPlace: (store: Store) => void
  onCancelPlace: () => void
}) {
  const mapRef = useRef<HTMLDivElement>(null)
  const regionStores = stores.filter(s => s.region === region).sort((a, b) => a.mapNumber - b.mapNumber)
  const isPlacingHere = placingStore?.region === region

  function handleMapClick(e: React.MouseEvent) {
    if (!isPlacingHere || !mapRef.current || !onPlace) return
    const rect = mapRef.current.getBoundingClientRect()
    onPlace(placingStore!.id, {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }

  const title = region === 'north' ? 'North San Diego' : 'South San Diego'

  return (
    <div className="h-full w-full bg-paper bg-texture font-serif text-ink flex flex-col">
      {/* banner */}
      <div className="bg-ink shrink-0 px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-display text-xl font-bold text-paper leading-none tracking-wide">San Diego Cold Brew Map</span>
          <span className="font-mono text-[9px] tracking-widest uppercase text-sepia">— by Mushroom</span>
        </div>
        {SITE_CONFIG.googleMapsUrl && (
          <a href={SITE_CONFIG.googleMapsUrl} target="_blank" rel="noopener noreferrer"
            className="font-mono text-[9px] tracking-widest uppercase text-sepia hover:text-paper transition-colors">
            Google Maps ↗
          </a>
        )}
      </div>

      {/* placing banner */}
      {isAdmin && isPlacingHere && (
        <div className="shrink-0 flex items-center justify-between gap-4 px-6 py-2 bg-terracotta/10 border-b border-terracotta/30">
          <span className="font-mono text-[11px] tracking-wider uppercase text-terracotta">
            Placing № {placingStore!.mapNumber} · {placingStore!.name || '(unnamed)'} — click map
          </span>
          <button onClick={onCancelPlace} className="font-mono text-[10px] tracking-widest uppercase text-terracotta/70 hover:text-terracotta">Cancel</button>
        </div>
      )}

      {/* body: 2 columns */}
      <div className="flex-1 min-h-0 flex gap-0">
        {/* map column (~65%) */}
        <div className="flex-[65] min-w-0 p-6 flex flex-col justify-center">
          <p className="font-mono text-[10px] tracking-widest uppercase text-sepia mb-3">— {title}</p>
          <div
            ref={mapRef}
            onClick={handleMapClick}
            className={`relative w-full border border-dashed border-sepia/40 overflow-hidden ${isPlacingHere ? 'cursor-crosshair' : ''}`}
            style={{ aspectRatio: '4/3' }}
          >
            <img src={mapSrc} alt={title} className="absolute inset-0 w-full h-full object-cover" />
            {regionStores.filter(s => s.mapCoords).map(store => {
              const { x = 0, y = 0 } = store.mapCoords!
              return (
                <button
                  key={store.id}
                  type="button"
                  onClick={e => { if (!isAdmin) return; e.stopPropagation(); onStartPlace(store) }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 ${isAdmin ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
                  style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
                  title={`${store.mapNumber} · ${store.name}`}
                >
                  <div className="relative w-7 h-7">
                    {store.isChain && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-terracotta/35 translate-x-1 translate-y-1" />
                        <div className="absolute inset-0 rounded-full bg-terracotta/60 translate-x-0.5 translate-y-0.5" />
                      </>
                    )}
                    <div className="relative w-7 h-7 rounded-full bg-terracotta border-2 border-ink shadow-sm flex items-center justify-center">
                      <span className="font-mono text-[10px] font-bold text-paper leading-none">{store.mapNumber}</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* legend column (~35%) */}
        <div className="flex-[35] min-w-0 border-l border-dashed border-ink/15 p-6 flex flex-col overflow-y-auto">
          <p className="font-mono text-[10px] tracking-widest uppercase text-sepia mb-4">Legend</p>
          {regionStores.length === 0 ? (
            <p className="font-serif italic text-xs text-ink/40">No stores assigned to this region yet.</p>
          ) : (
            <div className="space-y-3">
              {regionStores.map(store => (
                <div key={store.id} className="flex items-start gap-3">
                  <div className="relative shrink-0 w-6 h-6 mt-0.5">
                    {store.isChain && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-terracotta/35 translate-x-0.5 translate-y-0.5" />
                      </>
                    )}
                    <div className="relative w-6 h-6 rounded-full bg-terracotta flex items-center justify-center">
                      <span className="font-mono text-[9px] font-bold text-paper">{store.mapNumber}</span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-sm font-bold text-ink leading-tight truncate">{store.name}</p>
                    <p className="font-mono text-[9px] tracking-widest uppercase text-sepia">{store.neighborhood}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ColophonPage() {
  return (
    <div className="h-full w-full bg-ink text-paper flex flex-col items-center justify-center font-serif">
      <div className="text-center px-8 max-w-lg">
        <p className="font-mono text-xs tracking-[0.4em] uppercase text-sepia mb-6">Fin.</p>
        <h2 className="font-display text-7xl font-bold text-paper leading-none mb-6">Thanks for turning the pages.</h2>
        <p className="font-serif text-base text-paper leading-relaxed">
          Compiled with too much caffeine and strong opinions.
          <br />
          <span className="text-sepia">— Mushroom, San Diego</span>
        </p>
      </div>
    </div>
  )
}
