import type { Store } from '../../data/types'

interface Props {
  store: Store
}

function StickerPlaceholder() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-14 h-14 text-sepia/30">
      <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4zM6 1v3M10 1v3M14 1v3" strokeLinecap="round" />
    </svg>
  )
}

function AxisRow({ label, value }: { label: string; value: number }) {
  const pct = ((value - 1) / 4) * 100
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[9px] tracking-widest uppercase text-ink/70 w-14 shrink-0">{label}</span>
      <div className="relative h-3 flex-1">
        {/* axis line with tick marks */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-ink/20" />
        {[0, 25, 50, 75, 100].map(p => (
          <div key={p} className="absolute top-1/2 -translate-y-1/2 w-px h-2 bg-ink/20" style={{ left: `${p}%` }} />
        ))}
        {/* filled marker */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-terracotta" style={{ left: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function CardA({ store }: Props) {
  return (
    <div className="px-5 py-5">
      {/* top row: callout + sticker */}
      <div className="flex items-start gap-4 mb-4">
        {/* rating callout */}
        <div className="border border-ink/40 px-3 py-2.5 flex-1 min-w-0">
          <div className="space-y-1.5">
            <AxisRow label="Bitter" value={store.ratings.bitter} />
            <AxisRow label="Sweet" value={store.ratings.sweetness} />
            <AxisRow label="Power" value={store.ratings.power} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-14 shrink-0" />
            <div className="flex justify-between flex-1">
              <span className="font-mono text-[8px] text-ink/40 tracking-wider">Low</span>
              <span className="font-mono text-[8px] text-ink/40 tracking-wider">Strong</span>
            </div>
          </div>
        </div>

        {/* sticker */}
        <div className="w-28 h-28 shrink-0 flex items-center justify-center">
          {store.photo ? (
            <img src={store.photo} alt={store.name} className="max-w-full max-h-full object-contain" />
          ) : (
            <StickerPlaceholder />
          )}
        </div>
      </div>

      {/* number + name on one line */}
      <div className="flex items-center gap-2 mb-0.5">
        <div className="relative shrink-0 w-6 h-6">
          {store.isChain && (
            <>
              <div className="absolute inset-0 rounded-full bg-terracotta/35 translate-x-1 translate-y-1" />
              <div className="absolute inset-0 rounded-full bg-terracotta/60 translate-x-0.5 translate-y-0.5" />
            </>
          )}
          <div className="relative w-6 h-6 rounded-full bg-terracotta flex items-center justify-center">
            <span className="font-mono text-[9px] font-bold text-paper">{store.mapNumber}</span>
          </div>
        </div>
        <h3 className="font-display text-lg font-bold text-ink leading-tight truncate">{store.name}</h3>
      </div>

      <p className="font-mono text-[9px] tracking-widest uppercase text-sepia mb-1">{store.neighborhood} · {store.address}</p>
      <p className="font-serif italic text-xs text-ink/70 leading-relaxed line-clamp-6">
        {store.shortReview}
      </p>
    </div>
  )
}
