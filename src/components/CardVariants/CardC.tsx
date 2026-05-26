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

// equilateral triangle, centered at (50,50), radius 38
// vertices: Bitter (top), Sweet (bottom-left), Power (bottom-right)
const V = {
  bitter: { x: 50, y: 12 },
  sweet: { x: 17.1, y: 69 },
  power: { x: 82.9, y: 69 },
}
const CENTER = { x: 50, y: 50 }

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function pt(vertex: { x: number; y: number }, value: number) {
  const t = value / 5
  return `${lerp(CENTER.x, vertex.x, t).toFixed(2)},${lerp(CENTER.y, vertex.y, t).toFixed(2)}`
}

function RadarChart({ b, s, p }: { b: number; s: number; p: number }) {
  const polyMax = `${V.bitter.x},${V.bitter.y} ${V.sweet.x},${V.sweet.y} ${V.power.x},${V.power.y}`
  const polyVal = `${pt(V.bitter, b)} ${pt(V.sweet, s)} ${pt(V.power, p)}`

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* concentric scale triangles */}
      {[1, 2, 3, 4].map(level => {
        const pts = `${pt(V.bitter, level)} ${pt(V.sweet, level)} ${pt(V.power, level)}`
        return <polygon key={level} points={pts} fill="none" stroke="#E8E0D5" strokeWidth="0.3" />
      })}
      {/* max outline */}
      <polygon points={polyMax} fill="none" stroke="#C4956A" strokeWidth="0.5" strokeDasharray="1,1" opacity="0.6" />
      {/* axes */}
      <line x1={CENTER.x} y1={CENTER.y} x2={V.bitter.x} y2={V.bitter.y} stroke="#E8E0D5" strokeWidth="0.3" />
      <line x1={CENTER.x} y1={CENTER.y} x2={V.sweet.x} y2={V.sweet.y} stroke="#E8E0D5" strokeWidth="0.3" />
      <line x1={CENTER.x} y1={CENTER.y} x2={V.power.x} y2={V.power.y} stroke="#E8E0D5" strokeWidth="0.3" />
      {/* value polygon */}
      <polygon points={polyVal} fill="#8B4A42" fillOpacity="0.35" stroke="#8B4A42" strokeWidth="0.8" />
      {/* value dots */}
      {[pt(V.bitter, b), pt(V.sweet, s), pt(V.power, p)].map((p, i) => {
        const [x, y] = p.split(',')
        return <circle key={i} cx={x} cy={y} r="1.2" fill="#8B4A42" />
      })}
      {/* labels */}
      <text x="50" y="7" textAnchor="middle" fontSize="5" fontFamily="monospace" letterSpacing="0.5" fill="#2C1810">BITTER</text>
      <text x="13" y="77" textAnchor="middle" fontSize="5" fontFamily="monospace" letterSpacing="0.5" fill="#2C1810">SWEET</text>
      <text x="87" y="77" textAnchor="middle" fontSize="5" fontFamily="monospace" letterSpacing="0.5" fill="#2C1810">POWER</text>
    </svg>
  )
}

export default function CardC({ store }: Props) {
  return (
    <div className="px-5 py-5">
      {/* top row: radar + shop label */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-28 h-28 shrink-0">
          <RadarChart b={store.ratings.crust} s={store.ratings.softness} p={store.ratings.flavor} />
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full border border-sepia flex items-center justify-center shrink-0">
              <span className="font-mono text-[9px] font-bold text-ink">{store.mapNumber}</span>
            </div>
            <span className="font-mono text-[9px] tracking-widest uppercase text-sepia">map</span>
          </div>
          <h3 className="font-display text-base text-ink leading-tight mb-1">{store.name}</h3>
          <p className="font-mono text-[9px] tracking-widest uppercase text-sepia/70">{store.neighborhood}</p>
        </div>
      </div>

      {/* sticker — center */}
      <div className="h-32 flex items-center justify-center mb-3">
        {store.photo ? (
          <img src={store.photo} alt={store.name} className="max-w-full max-h-full object-contain" />
        ) : (
          <StickerPlaceholder />
        )}
      </div>

      {/* italic review */}
      <p className="font-serif italic text-xs text-ink/70 leading-relaxed text-center line-clamp-2">
        "{store.shortReview}"
      </p>
    </div>
  )
}
