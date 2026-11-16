import {useState} from 'react'
import {set, unset, type NumberInputProps} from 'sanity'

const STARS = [1, 2, 3, 4, 5]
const STAR_PATH =
  'M12 2.5l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 21.1l1.4-6.8L2.2 9.6l6.9-.8z'

/**
 * Star picker: click the left half of a star for a half rating, the right half for a full one.
 */
export function StarRatingInput(props: NumberInputProps) {
  const {value, onChange, readOnly} = props
  const [hover, setHover] = useState<number | null>(null)
  const shown = hover ?? value ?? 0

  const pick = (rating: number) => {
    // Clicking the current rating again clears it.
    onChange(rating === value ? unset() : set(rating))
  }

  return (
    <div>
      <div
        style={{display: 'flex', alignItems: 'center', gap: 4}}
        onMouseLeave={() => setHover(null)}
      >
        {STARS.map((star) => {
          const fill = Math.max(0, Math.min(1, shown - (star - 1)))
          return (
            <div key={star} style={{position: 'relative', width: 32, height: 32}}>
              <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
                <path d={STAR_PATH} fill="#d1d5db" />
                <clipPath id={`star-clip-${star}`}>
                  <rect x="0" y="0" width={24 * fill} height="24" />
                </clipPath>
                <path d={STAR_PATH} fill="#f5b301" clipPath={`url(#star-clip-${star})`} />
              </svg>
              {[star - 0.5, star].map((rating, i) => (
                <button
                  key={rating}
                  type="button"
                  disabled={readOnly}
                  aria-label={`${rating} ${rating === 1 ? 'star' : 'stars'}`}
                  onClick={() => pick(rating)}
                  onMouseEnter={() => setHover(rating)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: i === 0 ? 0 : '50%',
                    width: '50%',
                    height: '100%',
                    padding: 0,
                    border: 0,
                    background: 'transparent',
                    cursor: readOnly ? 'default' : 'pointer',
                  }}
                />
              ))}
            </div>
          )
        })}
        <span style={{marginLeft: 8, fontSize: 13, opacity: 0.7}}>
          {value ? `${value} / 5` : 'No rating yet'}
        </span>
      </div>
    </div>
  )
}
