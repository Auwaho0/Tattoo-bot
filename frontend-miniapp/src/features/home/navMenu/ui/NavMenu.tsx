import { ChevronsRight } from "lucide-react";
import { DualImage } from "@/shared/ui";
import { NAV_IMAGES, DEFAULT_NAV_IMAGE } from "../models/items";
import { Link } from "react-router-dom";
import { useTheme } from "@/features/home";
import { memo } from "react";

const PREFETCH_MAP: Record<string, () => Promise<unknown>> = {
  portfolio: () => import("@/pages/portfolio"),
  sketch: () => import("@/pages/sketches"),
  "tattoo-care": () => import("@/pages/tattooСare"),
  note: () => import("@/pages/note"),
};

interface NavMenuProps {
  id: string;
  title: string;
  context: string;
}

export const NavMenu = memo(({ id, title, context }: NavMenuProps) => {
  const isDark = useTheme((s) => s.isDark); // ← нужен только для DualImage
  const { light, dark } = NAV_IMAGES[id] ?? DEFAULT_NAV_IMAGE;
  const prefetch = PREFETCH_MAP[id];

  return (
    <div className="relative flex flex-col px-5 my-3 ">
      <Link
        to={`/${id}`}
        onMouseEnter={prefetch}
        onTouchStart={prefetch}
        onFocus={prefetch}
        className="border border-line bg-card rounded-xl h-25 cursor-pointer
                   transition-colors duration-300
                   hover:bg-card-hover
                   anim-tapScale anim-tapScaleDark"
      >
        <div className="grid grid-cols-[45fr_35fr_10fr] h-full rounded-lg">
          <div className="relative flex flex-col items-center justify-center rounded-xl"
            style={{ background: 'linear-gradient(to right, var(--c-surface) 85%, transparent 100%)' }}>
            <DualImage
              srcLight={light}
              srcDark={dark}
              active={isDark}
              mask="linear-gradient(to right, black 45%, transparent 100%)"
            />
          </div>

          <div className="flex flex-col items-center justify-center text-left">
            <span className="pl-2 w-full text-[16px] pb-1 font-nunito text-gold">
              {title}
            </span>
            <span className="pl-2 w-full mb-3 text-dim text-[12px] leading-2.75
                             font-nunito whitespace-pre-line">
              {context}
            </span>
          </div>

          <div className="flex flex-col items-end justify-end">
            <ChevronsRight className="mr-2 mb-2 text-gold" size={30} />
          </div>
        </div>
      </Link>
    </div>
  );
})
NavMenu.displayName = 'NavMenu';