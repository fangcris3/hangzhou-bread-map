import type { Store } from '../../data/types'
import RatingBar from '../RatingBar/RatingBar'

interface Props {
  store: Store
  onClick?: () => void
}

const ROTATIONS = ['rotate-[-1deg]', 'rotate-[0.5deg]', 'rotate-[1.5deg]', 'rotate-[-0.5deg]', 'rotate-[0deg]']

export default function CoffeeCard({ store, onClick }: Props) {
  const rotation = ROTATIONS[store.mapNumber % ROTATIONS.length]

  return (
    <article
      className={`bg-paper shadow-card rounded-sm ${rotation} transition-transform hover:rotate-0 hover:shadow-card-lg ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* photo */}
      <div className="relative bg-ink h-48 rounded-t-sm overflow-hidden">
        {store.photo ? (
          <img
            src={store.photo}
            alt={store.name}
            className="w-full h-full object-cover opacity-90"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-5xl text-sepia opacity-30 italic">cb</span>
          </div>
        )}
        {/* map number badge */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-terracotta flex items-center justify-center shadow-md">
          <span className="font-mono text-xs font-bold text-paper">{store.mapNumber}</span>
        </div>
        {/* neighborhood tag */}
        <div className="absolute bottom-3 left-3">
          <span className="font-mono text-[10px] tracking-widest uppercase bg-ink text-sepia px-2 py-1">
            {store.neighborhood}
          </span>
        </div>
      </div>

      {/* content */}
      <div className="p-5">
        <h3 className="font-display text-xl text-ink leading-tight mb-3">{store.name}</h3>
        <p className="font-mono text-[10px] text-sepia tracking-wide mb-3 opacity-70">
          {store.address}
        </p>
        <p className="font-serif text-sm text-ink leading-relaxed mb-5 line-clamp-3">
          {store.shortReview}
        </p>

        <div className="border-t border-ink border-opacity-10 pt-4 space-y-2">
          <RatingBar label="Bitter" value={store.ratings.bitter} />
          <RatingBar label="Sweet" value={store.ratings.sweetness} />
          <RatingBar label="Power" value={store.ratings.power} />
        </div>
      </div>
    </article>
  )
}
