'use client'

import {useState} from 'react'
import {set, unset, type NumberInputProps} from 'sanity'

const STARS = [1, 2, 3, 4, 5]
const STAR_PATH =
  'M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96L12 2.5z'

function Star({fill}: {fill: number}) {
  // fill is 0, 0.5 or 1
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true" style={{display: 'block'}}>
      <path d={STAR_PATH} fill="#e3e4e8" stroke="#c45500" strokeWidth="1" />
      {fill > 0 && (
        <path
          d={STAR_PATH}
          fill="#ffa41c"
          stroke="#c45500"
          strokeWidth="1"
          style={{clipPath: fill >= 1 ? undefined : 'inset(0 50% 0 0)'}}
        />
      )}
    </svg>
  )
}

/**
 * Studio input for a 0.5–5 star rating. Each star has two halves to click.
 */
export function StarRatingInput(props: NumberInputProps) {
  const {value, onChange, readOnly, elementProps} = props
  const [hover, setHover] = useState<number | null>(null)
  const shown = hover ?? (typeof value === 'number' ? value : 0)

  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap'}}>
      <div
        role="radiogroup"
        aria-label="Rating"
        id={elementProps.id}
        style={{display: 'flex', gap: 2}}
        onMouseLeave={() => setHover(null)}
      >
        {STARS.map((star) => (
          <div key={star} style={{position: 'relative', width: 32, height: 32}}>
            <Star fill={shown >= star ? 1 : shown >= star - 0.5 ? 0.5 : 0} />
            {[star - 0.5, star].map((rating, half) => (
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
                onClick={() => onChange(set(rating))}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: half === 0 ? 0 : '50%',
                  width: '50%',
                  padding: 0,
                  border: 0,
                  background: 'transparent',
                  cursor: readOnly ? 'default' : 'pointer',
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <span style={{fontSize: 14, fontVariantNumeric: 'tabular-nums', minWidth: 72}}>
        {shown ? `${shown} out of 5` : 'No rating'}
      </span>
      {typeof value === 'number' && !readOnly && (
        <button
          type="button"
          onClick={() => onChange(unset())}
          style={{
            fontSize: 13,
            background: 'transparent',
            border: '1px solid currentColor',
            borderRadius: 4,
            padding: '2px 8px',
            cursor: 'pointer',
            opacity: 0.7,
            color: 'inherit',
          }}
        >
          Clear
        </button>
      )}
    </div>
  )
}
