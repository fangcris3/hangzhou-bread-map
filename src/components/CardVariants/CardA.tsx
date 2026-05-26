import type { Store } from '../../data/types'

interface Props {
  store: Store
}

function StickerPlaceholder() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-14 h-14 text-sepia/30" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 16C3 12.5 5.5 9.5 12 9.5C18.5 9.5 21 12.5 21 16V20H3V16Z" />
      <path d="M7 14C8.5 11.5 15.5 11.5 17 14" />
      <line x1="3" y1="20" x2="21" y2="20" />
    </svg>
  )
}

function AxisRow({ label, value }: { label: string; value: number }) {
  const pct = ((value - 1) / 4) * 100
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[9px] tracking-widest uppercase text-ink/70 w-14 shrink-0">{label}</span>
      <div className="relative h-3 flex-1">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-ink/20" />
        {[0, 25, 50, 75, 100].map(p => (
          <div key={p} className="absolute top-1/2 -translate-y-1/2 w-px h-2 bg-ink/20" style={{ left: `${p}%` }} />
        ))}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-terracotta" style={{ left: `${pct}%` }} />
      </div>
    </div>
  )
}

function RatingBadge({ rating }: { rating: string }) {
  const styles: Record<string, string> = {
    '强推': 'bg-terracotta text-paper',
    '经典老店': 'bg-sepia text-paper',
    '推荐': 'bg-ink/10 text-ink',
  }
  const cls = styles[rating] ?? 'bg-ink/10 text-ink'
  return (
    <span className={`font-mono text-[8px] tracking-widest uppercase px-1.5 py-0.5 rounded-sm shrink-0 ${cls}`}>
      {rating}
    </span>
  )
}

export default function CardA({ store }: Props) {
  return (
    <div className="px-5 py-5">
      {/* top row: axis chart + photo */}
      <div className="flex items-start gap-4 mb-4">
        <div className="border border-ink/40 px-3 py-2.5 flex-1 min-w-0">
          <div className="space-y-1.5">
            <AxisRow label="酥脆" value={store.ratings.crust} />
            <AxisRow label="松软" value={store.ratings.softness} />
            <AxisRow label="风味" value={store.ratings.flavor} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-14 shrink-0" />
            <div className="flex justify-between flex-1">
              <span className="font-mono text-[8px] text-ink/40 tracking-wider">低</span>
              <span className="font-mono text-[8px] text-ink/40 tracking-wider">高</span>
            </div>
          </div>
        </div>
        <div className="w-28 h-28 shrink-0 flex items-center justify-center">
          {store.photo ? (
            <img src={store.photo} alt={store.name} className="max-w-full max-h-full object-contain" />
          ) : (
            <StickerPlaceholder />
          )}
        </div>
      </div>

      {/* number + name + rating badge */}
      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
        <div className="relative shrink-0 w-6 h-6">
          <div className="relative w-6 h-6 rounded-full bg-terracotta flex items-center justify-center">
            <span className="font-mono text-[9px] font-bold text-paper">{store.mapNumber}</span>
          </div>
        </div>
        <h3 className="font-display text-lg font-bold text-ink leading-tight truncate flex-1 min-w-0">{store.name}</h3>
        {store.rating && <RatingBadge rating={store.rating} />}
      </div>

      {/* neighborhood + address */}
      <p className="font-mono text-[9px] tracking-widest uppercase text-sepia mb-1.5">
        {store.neighborhood} · {store.address}
      </p>

      {/* signature items */}
      {store.signatureItems && store.signatureItems.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {store.signatureItems.map(item => (
            <span key={item} className="font-mono text-[8px] tracking-wide text-terracotta border border-terracotta/40 px-1.5 py-0.5 rounded-sm">
              {item}
            </span>
          ))}
        </div>
      )}

      {/* review */}
      <p className="font-serif italic text-xs text-ink/70 leading-relaxed line-clamp-4">
        {store.shortReview}
      </p>

      {/* confidence warning */}
      {store.confidence === 'low' && (
        <p className="font-mono text-[8px] text-sepia/70 mt-1.5">⚠ 地址待核实</p>
      )}
    </div>
  )
}
