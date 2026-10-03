import { useTheme } from '@/features/home';
import { ThemeToggle } from '@/features/home';
import bgLight from '@/assets/light/bg-light.png';
import bgDark from '@/assets/dark/bg-hero.png';


import { DualImage } from '@/shared/ui';
import { Hero } from '@/features/home';
import { NavMenu } from '@/features/home/navMenu';

const NAVITEMS = [
  {
    id: "sketch",
    title: "ЭСКИЗ",
    context: "Готовые эскизы\nсо скидкой",
  },
  {
    id: "portfolio",
    title: "ПОРТФОЛИО",
    context: "Мои работы",
  },
  {
    id: "about",
    title: "ИНФОРМАЦИЯ",
    context: "Обо мне, стиле\nи подходе",
  },
  {
    id: "note",
    title: "ЗАПИСЬ",
    context: "Запись на сеанс\nили консультацию",
  },
];


export const HomePage = () => {
  const isDark = useTheme((s) => s.isDark);
  return (
    <main className={`min-h-screen theme-transition flex justify-center 
      ${isDark
        ? 'bg-[#080808] text-[#f0ebe4]'
        : 'bg-[#e8e5dc] text-[#1c1a17]'
      }`}>
      <div className={`w-full max-w-md min-h-screen relative lg:mt-4 flex flex-col theme-transition shadow-2xl 
        ${isDark
          ? 'bg-[#000000] border-x border-[#1a1816]'
          : 'bg-[#f7f6f2] border-x border-[#ded8cb]'
        }`}>

        <div
          className='relative h-70 px-2'
        >
          <DualImage
            srcLight={bgLight}
            srcDark={bgDark}
            active={isDark}
            className=''
            mask={[
              // низ — плавное затухание
              'linear-gradient(to bottom, black 55%, transparent 100%)',
              // бока — затухание слева и справа
              'linear-gradient(to right, black 85%, transparent 100%)',
            ].join(', ')}
          >

            <ThemeToggle />

            <Hero />
          </DualImage>




        </div>

        <div className='flex flex-col'>
          {NAVITEMS.map(({ id, title, context }) => (
            <NavMenu
              key={id}
              id={id}
              title={title}
              context={context}
            />
          ))}
        </div>


      </div >
    </main >
  )
};