const STAR_PATH =
  'M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96L12 2.5z'

/** Amazon-style star row for a rating from 0 to 5 in half-star steps. */
export default function StarRating({rating, className = ''}: {rating: number; className?: string}) {
  const value = Math.max(0, Math.min(5, Math.round(rating * 2) / 2))
  return (
    <div
      role="img"
      aria-label={`${value} out of 5 stars`}
      className={`flex items-center gap-0.5 ${className}`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = value >= star ? 'full' : value >= star - 0.5 ? 'half' : 'empty'
        return (
          <svg key={star} viewBox="0 0 24 24" className="size-5" aria-hidden="true">
            <path d={STAR_PATH} fill="#e3e4e8" stroke="#de7921" strokeWidth="1" />
            {fill !== 'empty' && (
              <path
                d={STAR_PATH}
                fill="#ffa41c"
                stroke="#de7921"
                strokeWidth="1"
                style={fill === 'half' ? {clipPath: 'inset(0 50% 0 0)'} : undefined}
              />
            )}
          </svg>
        )
      })}
    </div>
  )
}
