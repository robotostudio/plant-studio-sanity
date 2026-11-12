const STAR = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'

/** Read-only row of five stars; `value` can be any multiple of 0.5. */
export default function Stars({value, size = 20}: {value: number; size?: number}) {
  return (
    <span role="img" aria-label={`${value} out of 5 stars`} className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.max(0, Math.min(1, value - (n - 1)))
        return (
          <svg key={n} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
            <defs>
              <clipPath id={`clip-${n}-${fill}`}>
                <rect x="0" y="0" width={24 * fill} height="24" />
              </clipPath>
            </defs>
            <path d={STAR} fill="#d1d5db" />
            <path d={STAR} fill="#f59e0b" clipPath={`url(#clip-${n}-${fill})`} />
          </svg>
        )
      })}
    </span>
  )
}
