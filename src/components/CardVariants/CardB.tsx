import type { Store } from '../../data/types'

interface Props {
  store: Store
}

function StickerPlaceholder() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16 text-sepia/30">
      <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4zM6 1v3M10 1v3M14 1v3" strokeLinecap="round" />
    </svg>
  )
}

function BarRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[10px] tracking-widest uppercase text-ink/70 w-14 shrink-0">{label}</span>
      <div className="flex gap-0.5 flex-1">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className={`h-3 flex-1 ${i < value ? 'bg-terracotta' : 'bg-paper'}`} />
        ))}
      </div>
      <span className="font-display text-lg text-ink leading-none w-4 text-right">{value}</span>
    </div>
  )
}

export default function CardB({ store }: Props) {
  return (
    <div className="px-5 py-5">
      {/* rating poster — top band */}
      <div className="space-y-2 mb-5">
        <BarRow label="Bitter" value={store.ratings.bitter} />
        <BarRow label="Sweet" value={store.ratings.sweetness} />
        <BarRow label="Power" value={store.ratings.power} />
      </div>

      {/* sticker — center hero */}
      <div className="h-40 flex items-center justify-center mb-4">
        {store.photo ? (
          <img src={store.photo} alt={store.name} className="max-w-full max-h-full object-contain" />
        ) : (
          <StickerPlaceholder />
        )}
      </div>

      {/* bottom strip */}
      <div className="border-t border-ink/15 pt-3 flex items-center gap-2">
        <div className="w-5 h-5 rounded-full border border-sepia flex items-center justify-center shrink-0">
          <span className="font-mono text-[8px] font-bold text-ink">{store.mapNumber}</span>
        </div>
        <span className="font-mono text-[9px] tracking-widest uppercase text-sepia/80 shrink-0">
          {store.neighborhood}
        </span>
        <span className="text-paper">·</span>
        <span className="font-display text-xs text-ink truncate">{store.name}</span>
      </div>
    </div>
  )
}
