import {useCallback, useState} from 'react'
import {set, unset, type NumberInputProps} from 'sanity'

const STAR_PATH =
  'M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96L12 2.5z'

function Star({fill, size = 32}: {fill: number; size?: number}) {
  const id = `star-clip-${Math.round(fill * 100)}`
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <clipPath id={id}>
          <rect x="0" y="0" width={24 * fill} height="24" />
        </clipPath>
      </defs>
      <path d={STAR_PATH} fill="#fff" stroke="#de7921" strokeWidth="1.2" />
      <path d={STAR_PATH} fill="#ffa41c" stroke="#de7921" strokeWidth="1.2" clipPath={`url(#${id})`} />
    </svg>
  )
}

/**
 * Amazon-style star picker for a review's rating. Click the left half of a star
 * for a half star, the right half for a full one. Steps of 0.5 from 0.5 to 5.
 */
export function StarRatingInput(props: NumberInputProps) {
  const {value, onChange, readOnly} = props
  const [hover, setHover] = useState<number | null>(null)
  const shown = hover ?? value ?? 0

  const pick = useCallback(
    (next: number) => {
      if (readOnly) return
      onChange(next === value ? unset() : set(next))
    },
    [onChange, readOnly, value],
  )

  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
      <div
        role="radiogroup"
        aria-label="Star rating"
        style={{display: 'flex', gap: 2}}
        onMouseLeave={() => setHover(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const fill = Math.max(0, Math.min(1, shown - (star - 1)))
          return (
            <span key={star} style={{position: 'relative', display: 'inline-flex'}}>
              <Star fill={fill} />
              {[star - 0.5, star].map((rating, i) => (
                <button
                  key={rating}
                  type="button"
                  role="radio"
                  aria-checked={value === rating}
                  aria-label={`${rating} ${rating === 1 ? 'star' : 'stars'}`}
                  title={`${rating} ${rating === 1 ? 'star' : 'stars'}`}
                  disabled={readOnly}
                  onMouseEnter={() => setHover(rating)}
                  onFocus={() => setHover(rating)}
                  onBlur={() => setHover(null)}
                  onClick={() => pick(rating)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: i === 0 ? 0 : '50%',
                    width: '50%',
                    padding: 0,
                    border: 0,
                    background: 'transparent',
                    cursor: readOnly ? 'default' : 'pointer',
                  }}
                />
              ))}
            </span>
          )
        })}
      </div>
      <span style={{fontSize: 14, color: '#007185', fontVariantNumeric: 'tabular-nums'}}>
        {shown ? `${shown.toFixed(1)} out of 5 stars` : 'No rating yet'}
      </span>
    </div>
  )
}
