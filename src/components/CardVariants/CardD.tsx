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

function BigDigit({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-6xl font-bold text-ink leading-none">{value}</span>
      <span className="font-mono text-[9px] tracking-widest uppercase text-sepia mt-2">{label}</span>
    </div>
  )
}

export default function CardD({ store }: Props) {
  return (
    <div className="px-6 py-5">
      {/* big numerals as headline */}
      <div className="flex items-center justify-center gap-5 mb-2">
        <BigDigit label="酥脆" value={store.ratings.crust} />
        <span className="font-display text-4xl text-sepia/30 leading-none">·</span>
        <BigDigit label="松软" value={store.ratings.softness} />
        <span className="font-display text-4xl text-sepia/30 leading-none">·</span>
        <BigDigit label="风味" value={store.ratings.flavor} />
      </div>

      {/* sticker — center */}
      <div className="h-32 flex items-center justify-center my-4">
        {store.photo ? (
          <img src={store.photo} alt={store.name} className="max-w-full max-h-full object-contain" />
        ) : (
          <StickerPlaceholder />
        )}
      </div>

      {/* bottom strip */}
      <div className="border-t border-ink/15 pt-3 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full border border-sepia flex items-center justify-center shrink-0">
          <span className="font-mono text-[9px] font-bold text-ink">{store.mapNumber}</span>
        </div>
        <span className="font-display text-sm text-ink truncate flex-1">{store.name}</span>
        <span className="font-mono text-[9px] tracking-widest uppercase text-sepia shrink-0">
          {store.neighborhood}
        </span>
      </div>

      <p className="font-serif italic text-xs text-ink/60 leading-relaxed mt-3 line-clamp-1">
        {store.shortReview}
      </p>
    </div>
  )
}
