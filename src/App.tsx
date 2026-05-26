import { useRef, useState } from 'react'
import { loadStores, saveStores } from './data/storage'
import type { Store } from './data/types'
import CoverPage from './components/CoverPage/CoverPage'
import CardA from './components/CardVariants/CardA'
import AdminPanel from './components/AdminPanel/AdminPanel'
import Demo from './components/Demo/Demo'
import HangzhouMap from './components/HangzhouMap/HangzhouMap'
import Book, { type BookHandle, type BookPage, type BookBackdrop } from './components/Book/Book'

const params = new URLSearchParams(window.location.search)
const CARDS_PER_PAGE = 6
const backdropParam = params.get('backdrop')
const BACKDROP: BookBackdrop = backdropParam === 'desk' || backdropParam === 'cream' ? backdropParam : 'dark'

export default function App() {
  if (params.get('demo') === 'true') return <Demo />

  // Admin mode is intentionally dev-only: production builds tree-shake this to `false`,
  // so the deployed bundle contains no admin code. To edit content, run `npm run dev` locally.
  const isAdmin = import.meta.env.DEV && params.get('admin') === 'true'

  const [stores, setStores] = useState<Store[]>(() => loadStores(isAdmin))
  const [editingStore, setEditingStore] = useState<Store | null>(null)
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

  function handleNew() {
    const nextMapNumber = stores.length > 0 ? Math.max(...stores.map(s => s.mapNumber)) + 1 : 1
    setEditingStore({
      id: crypto.randomUUID(),
      name: '',
      address: '',
      neighborhood: '',
      shortReview: '',
      ratings: { crust: 3, softness: 3, flavor: 3 },
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
      id: 'map',
      content: <HangzhouMap stores={stores} />,
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
              <h2 className="font-display text-5xl font-bold text-ink mb-1 leading-none">面包笔记</h2>
              <p className="font-mono text-xs text-sepia tracking-widest uppercase">— 按编号排列</p>
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
          <h2 className="font-display text-5xl font-bold text-ink mb-1 leading-none">地图</h2>
          <p className="font-mono text-xs text-sepia tracking-widest uppercase mb-6">— 西湖区 · 拱墅区</p>
          <div className="border border-dashed border-sepia/40 overflow-hidden rounded-sm" style={{ height: 320 }}>
            <HangzhouMap stores={stores} />
          </div>
        </section>
      </div>

      {isAdmin && editingStore && (
        <AdminPanel
          store={editingStore}
          isNew={!stores.some(s => s.id === editingStore.id)}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setEditingStore(null)}
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
      <div className="bg-[#4A2D1A] shrink-0 px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-display text-xl font-bold text-paper leading-none tracking-wide">杭州面包地图</span>
        </div>
        {pageCount > 1 && (
          <span className="font-mono text-[9px] tracking-widest uppercase text-paper/70">
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


function ColophonPage() {
  return (
    <div className="h-full w-full bg-ink text-paper flex flex-col items-center justify-center font-serif">
      <div className="text-center px-8 max-w-lg">
        <p className="font-mono text-xs tracking-[0.4em] uppercase text-sepia mb-6">Fin.</p>
        <h2 className="font-display text-7xl font-bold text-paper leading-none mb-6">谢谢你翻到了最后一页。</h2>
        <p className="font-serif text-base text-paper leading-relaxed">
          用太多面包和强烈的个人口味编成的一本书。
        </p>
        <p className="font-serif text-lg text-paper mt-6 tracking-wide">
          杭州，浙江
        </p>
      </div>
    </div>
  )
}
