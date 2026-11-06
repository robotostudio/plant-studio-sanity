import {NextMark, SanityMark} from '@/app/components/BrandMarks'

export default function SideBySideIcons() {
  return (
    <div aria-hidden="true" className="relative flex gap-[0] -mt-16 group select-none">
      <div className="z-10 aspect-square w-32 h-32 flex justify-center items-center rounded-full border-white border-4 bg-white transform translate-x-2 group-hover:scale-110 group-hover:-translate-x-5 transition-transform duration-200 ease-out motion-reduce:transform-none">
        <SanityMark size={120} />
      </div>
      <div className="text-black opacity-0 text-4xl scale-50 font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:opacity-100 group-hover:scale-100 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none">
        +
      </div>
      <div className="aspect-square w-32 h-32 border-white border-4 flex justify-center items-center rounded-full transform -translate-x-2 group-hover:scale-110 group-hover:translate-x-5 transition-transform duration-200 ease-out motion-reduce:transform-none">
        <NextMark size={120} />
      </div>
    </div>
  )
}
