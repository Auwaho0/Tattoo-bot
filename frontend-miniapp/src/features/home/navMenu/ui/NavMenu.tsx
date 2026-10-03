import { ChevronsRight } from "lucide-react";
import { useTheme } from '@/features/home';
import { DualImage } from '@/shared/ui';
import { NAV_IMAGES, DEFAULT_NAV_IMAGE } from '../models/items';

import { Link } from 'react-router-dom';

interface NavMenuProps {
  id: string;
  title: string;
  context: string;
}

export const NavMenu = ({ id, title, context }: NavMenuProps) => {
  const isDark = useTheme((s) => s.isDark);

  const { light, dark } = NAV_IMAGES[id] ?? DEFAULT_NAV_IMAGE;

  return (
    <div className="relative flex flex-col px-5 my-3">
      <Link to={`/${id}`} className="border border-[#322d27] bg-[#111111] rounded-xl h-25 cursor-pointer hover:bg-[#242424]">
        <div className="grid grid-cols-[45fr_35fr_10fr] h-full rounded-lg">
          <div
            className="relative flex flex-col items-center justify-center bg-black rounded-xl"
            style={{ background: 'linear-gradient(to right, black 85%, transparent 100%)' }}
          >
            <DualImage
              srcLight={light}
              srcDark={dark}
              active={isDark}
              className=""
              mask={[
                'linear-gradient(to right, green 45%, transparent 100%)',
              ].join(', ')}
            />
          </div>

          <div className="flex flex-col items-center justify-center text-left">
            <span
              className="pl-2 w-full text-[#bba68d] text-[16px] pb-1 font-nunito-sans"
              style={{ fontWeight: 400 }}
            >
              {title}
            </span>
            <span
              className="pl-2 w-full mb-3 text-[#898989] text-[12px] leading-[11px] font-nunito-sans whitespace-pre-line"
              style={{ fontWeight: 400 }}
            >
              {context}
            </span>
          </div>

          <div className="flex flex-col items-end justify-end text">
            <ChevronsRight
              color="#a89681"
              className="mr-2 mb-2"
              size={30}
            />
          </div>
        </div>
      </Link>
    </div >
  );
};