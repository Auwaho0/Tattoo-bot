import { useTheme } from '@/features/home';
export const Hero = () => {
  const isDark = useTheme((s) => s.isDark);
  return (
    <div
      className={`relative top-19 flex flex-col justify-center items-center transition-all duration-500 
        ${isDark
          ? 'text-[#bba68d]'
          : 'text-[#41321f]'
        }`}>

      <span
        className='relative z-10 text-7xl font-gothic '
      >
        EverArt
      </span>

      <span
        className='relative z-2 tracking-[0.5em] font-nunito-sans -top-3'
        style={{ fontWeight: 450 }}
      >
        TATTOO
      </span>

      <span
        className='relative z-4 font-script text-xl'
      >
        Искусство на твоей жизни
      </span>
    </div>
  )
}