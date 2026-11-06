'use client'

import {useState} from 'react'

import Stars from '@/app/components/Stars'

/**
 * Star picker: click the left half of a star for a half step, the right half
 * for a whole one. Works with the keyboard too (arrow keys move between steps).
 */
export default function StarRatingInput({name}: {name: string}) {
  const [value, setValue] = useState(0)
  const [hover, setHover] = useState(0)
  const shown = hover || value
  const steps = Array.from({length: 10}, (_, i) => (i + 1) / 2)

  return (
    <div className="flex items-center gap-3">
      <div className="relative inline-block" onMouseLeave={() => setHover(0)}>
        <Stars value={shown} size={36} />
        <div className="absolute inset-0 flex">
          {steps.map((step) => (
            <label
              key={step}
              className="flex-1 cursor-pointer has-[:focus-visible]:outline has-[:focus-visible]:outline-2"
              onMouseEnter={() => setHover(step)}
            >
              <span className="sr-only">{step} stars</span>
              <input
                type="radio"
                name={name}
                value={step}
                required
                checked={value === step}
                onChange={() => setValue(step)}
                className="sr-only"
              />
            </label>
          ))}
        </div>
      </div>
      <span className="text-gray-600" aria-hidden="true">
        {value ? `${value} / 5` : 'Choose a rating'}
      </span>
    </div>
  )
}
