import ResolvedLink from '@/app/components/ResolvedLink'
import type {ExtractPageBuilderType} from '@/sanity/lib/types'

type RetroCtaProps = {
  block: ExtractPageBuilderType<'retroCta'>
  index: number
  pageId: string
  pageType: string
}

const retroFont = {fontFamily: '"Comic Sans MS", "Comic Sans", "Chalkboard SE", cursive'}
const slideFont = {fontFamily: '"Times New Roman", Times, serif'}

/** A call to action dressed as a slide from a 2003 slideshow deck. */
export default function RetroCta({block, index}: RetroCtaProps) {
  const {heading, subheading, bullets, button, footer} = block

  return (
    <section className="container py-12">
      <div className="mx-auto max-w-5xl border-2 border-[#808080] bg-[#d4d0c8] p-1 shadow-[4px_4px_0_#404040]">
        {/* Window title bar */}
        <div className="flex items-center justify-between bg-linear-to-r from-[#0a246a] to-[#a6caf0] px-2 py-1 text-sm font-bold text-white" style={{fontFamily: 'Tahoma, Verdana, sans-serif'}}>
          <span>Slide Show - [Why_Hire_Us_FINAL_v7.ppt]</span>
          <span aria-hidden="true" className="flex gap-1">
            {['_', '□', '×'].map((c) => (
              <span key={c} className="flex h-4 w-4 items-center justify-center border border-white/80 bg-[#d4d0c8] text-[10px] leading-none text-black">
                {c}
              </span>
            ))}
          </span>
        </div>

        {/* The slide */}
        <div className="relative overflow-hidden aspect-auto md:aspect-[4/3] lg:aspect-[16/10] bg-[radial-gradient(ellipse_at_top_left,#3a6fd8_0%,#0b2a8a_55%,#000a4a_100%)] px-6 py-10 sm:px-12 sm:py-14 text-white" style={slideFont}>
          {/* Swoosh decoration */}
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-[140%] -rotate-6 rounded-[50%] bg-linear-to-r from-[#ffcc00]/70 via-[#ff9900]/40 to-transparent" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-10 h-56 w-[140%] -rotate-3 rounded-[50%] bg-linear-to-r from-[#66ccff]/50 to-transparent" />

          <div className="relative flex h-full flex-col">
            <h2
              className="retro-wordart text-center text-4xl font-black italic leading-tight sm:text-5xl lg:text-6xl"
              style={retroFont}
            >
              {heading}
            </h2>
            {subheading && (
              <p className="mt-4 text-center text-xl text-[#ffff99] sm:text-2xl" style={retroFont}>
                {subheading}
              </p>
            )}

            {bullets && bullets.length > 0 && (
              <ul className="mx-auto mt-8 max-w-2xl space-y-3 text-xl sm:text-2xl">
                {bullets.map((bullet, i) => (
                  <li key={i} className="retro-fly-in flex items-start gap-3" style={{animationDelay: `${0.4 + i * 0.35}s`}}>
                    <span aria-hidden="true" className="mt-1 text-[#ffcc00]">
                      ★
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {button?.buttonText && button?.link && (
              <div className="mt-10 flex justify-center">
                <ResolvedLink
                  link={button.link}
                  className="retro-button inline-block border-2 border-t-white border-l-white border-r-[#404040] border-b-[#404040] bg-[#d4d0c8] px-8 py-3 text-lg font-bold text-black active:border-t-[#404040] active:border-l-[#404040] active:border-r-white active:border-b-white"
                >
                  <span style={{fontFamily: 'Tahoma, Verdana, sans-serif'}}>{button.buttonText}</span>
                </ResolvedLink>
              </div>
            )}

            <div className="mt-auto flex items-end justify-between pt-10 text-sm text-white/80" style={{fontFamily: 'Arial, sans-serif'}}>
              <span>{footer}</span>
              <span>Slide {index + 1}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
