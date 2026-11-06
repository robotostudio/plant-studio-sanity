import {useState} from 'react'
import {set, unset, type NumberInputProps} from 'sanity'

const STAR = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'

/** Studio input for the review rating: click the left half of a star for a half step. */
export function StarRatingInput(props: NumberInputProps) {
  const {value, onChange, readOnly} = props
  const [hover, setHover] = useState(0)
  const shown = hover || value || 0

  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
      <div style={{display: 'flex', gap: 2}} onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => {
          const fill = Math.max(0, Math.min(1, shown - (n - 1)))
          return (
            <div key={n} style={{position: 'relative', width: 36, height: 36}}>
              <svg width={36} height={36} viewBox="0 0 24 24" aria-hidden="true">
                <defs>
                  <clipPath id={`studio-star-${n}`}>
                    <rect x="0" y="0" width={24 * fill} height="24" />
                  </clipPath>
                </defs>
                <path d={STAR} fill="#d1d5db" />
                <path d={STAR} fill="#f59e0b" clipPath={`url(#studio-star-${n})`} />
              </svg>
              {[n - 0.5, n].map((step, i) => (
                <button
                  key={step}
                  type="button"
                  disabled={readOnly}
                  aria-label={`${step} stars`}
                  onMouseEnter={() => setHover(step)}
                  onClick={() => onChange(step === value ? unset() : set(step))}
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
            </div>
          )
        })}
      </div>
      <span>{value ? `${value} / 5` : 'Not rated'}</span>
    </div>
  )
}
