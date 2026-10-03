import { BackButton } from '@/shared/ui';
import { useTheme } from '@/features/home';



export const AboutPage = () => {
  const isDark = useTheme((s) => s.isDark);
  return (
    <div className="p-4 bg-black h-full">
      <BackButton isDark={isDark} />

      <h1 className="serif text-2xl mt-3 mb-4">Обо мне</h1>


    </div>
  );
};