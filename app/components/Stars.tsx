const STAR_PATH =
  'M12 2.5l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 21.1l1.4-6.8L2.2 9.6l6.9-.8z'

export default function Stars({rating, id}: {rating: number; id: string}) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.max(0, Math.min(1, rating - (star - 1)))
        const clipId = `${id}-star-${star}`
        return (
          <svg key={star} viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d={STAR_PATH} fill="#d1d5db" />
            <clipPath id={clipId}>
              <rect x="0" y="0" width={24 * fill} height="24" />
            </clipPath>
            <path d={STAR_PATH} fill="#f5b301" clipPath={`url(#${clipId})`} />
          </svg>
        )
      })}
    </span>
  )
}
