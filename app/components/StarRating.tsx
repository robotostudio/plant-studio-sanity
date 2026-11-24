const STAR_PATH =
  'M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96L12 2.5z'

/** Amazon-style stars: gold fill, orange outline, half stars clipped. */
export default function StarRating({rating, size = 20}: {rating: number; size?: number}) {
  const clamped = Math.max(0, Math.min(5, Math.round(rating * 2) / 2))
  const label = `${clamped.toFixed(1)} out of 5 stars`
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={label} title={label}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.max(0, Math.min(1, clamped - (star - 1)))
        return (
          <svg key={star} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
            <path d={STAR_PATH} fill="#fff" stroke="#de7921" strokeWidth="1.2" />
            {fill > 0 && (
              <path
                d={STAR_PATH}
                fill="#ffa41c"
                stroke="#de7921"
                strokeWidth="1.2"
                style={fill < 1 ? {clipPath: `inset(0 ${100 - fill * 100}% 0 0)`} : undefined}
              />
            )}
          </svg>
        )
      })}
    </span>
  )
}
