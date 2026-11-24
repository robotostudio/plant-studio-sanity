import ResolvedLink from '@/app/components/ResolvedLink'
import type {ExtractPageBuilderType} from '@/sanity/lib/types'

type RetroCtaProps = {
  block: ExtractPageBuilderType<'retroCta'>
  index: number
  pageId: string
  pageType: string
}

const SLIDE_FONT = {fontFamily: 'Tahoma, Verdana, "Trebuchet MS", Arial, sans-serif'}

/** Page builder block: a call to action styled like a 2003 presentation slide. */
export default function RetroCta({block}: RetroCtaProps) {
  const {heading, subheading, bullets, button, footer} = block

  return (
    <section className="py-12 sm:py-20 bg-[#3a6ea5]">
      <div className="container">
        <div
          className="mx-auto max-w-5xl border-[3px] border-[#d4d0c8] shadow-[6px_6px_0_#000]"
          style={SLIDE_FONT}
        >
          {/* Window title bar */}
          <div className="flex items-center justify-between bg-linear-to-r from-[#0a246a] to-[#a6caf0] px-2 py-1 text-white text-sm font-bold">
            <span>Microsoft PowerPoint - [Sales_Pitch_FINAL_v7_REALLYFINAL.ppt]</span>
            <span aria-hidden="true" className="flex gap-1">
              {['_', '□', '×'].map((c) => (
                <span
                  key={c}
                  className="inline-flex size-5 items-center justify-center bg-[#d4d0c8] text-black text-xs border border-t-white border-l-white border-r-[#404040] border-b-[#404040]"
                >
                  {c}
                </span>
              ))}
            </span>
          </div>

          {/* The slide */}
          <div className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top_left,#2b5cb8_0%,#0b1f5c_60%,#050d2e_100%)] px-6 py-10 sm:px-12 sm:py-14">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-16 size-64 rounded-full bg-[radial-gradient(circle,#ffe066_0%,transparent_70%)] opacity-30"
            />
            <h2
              className="relative text-3xl sm:text-5xl lg:text-6xl font-bold italic text-[#ffcc00] text-center motion-safe:animate-[retro-fly-in_0.8s_ease-out_both]"
              style={{textShadow: '3px 3px 0 #b22222, 6px 6px 0 #000'}}
            >
              {heading}
            </h2>
            {subheading && (
              <p className="relative mt-4 text-center text-lg sm:text-2xl text-[#ccffff]">
                {subheading}
              </p>
            )}
            <hr className="relative my-8 border-0 h-1 bg-linear-to-r from-transparent via-[#ffcc00] to-transparent" />

            {bullets && bullets.length > 0 && (
              <ul className="relative mx-auto max-w-2xl space-y-3 text-lg sm:text-2xl text-white">
                {bullets.map((bullet, i) => (
                  <li
                    key={i}
                    className="flex gap-3 motion-safe:animate-[retro-fly-in_0.6s_ease-out_both]"
                    style={{animationDelay: `${0.3 + i * 0.25}s`}}
                  >
                    <span aria-hidden="true" className="text-[#ffcc00]">
                      ◆
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {button?.buttonText && button?.link && (
              <div className="relative mt-10 flex justify-center">
                <ResolvedLink
                  link={button.link}
                  className="inline-block bg-[#d4d0c8] px-6 py-3 text-base sm:text-lg font-bold text-black border-2 border-t-white border-l-white border-r-[#404040] border-b-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-r-white active:border-b-white hover:bg-[#ffffcc] focus-visible:outline-dotted focus-visible:outline-2 focus-visible:outline-black"
                >
                  {button.buttonText}
                </ResolvedLink>
              </div>
            )}

            <div className="relative mt-10 flex flex-wrap justify-between gap-2 text-xs sm:text-sm text-[#a6caf0]">
              <span>{footer}</span>
              <span>Click to advance ▸</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
