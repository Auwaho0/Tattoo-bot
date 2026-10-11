import { memo } from "react";

export const Hero =  memo(() => (
  <div className="relative top-19 flex flex-col justify-center items-center text-gold">
    <span className="relative z-10 text-7xl font-gothic">
      EverArt
    </span>
    <span className="relative z-2 tracking-[0.5em] font-nunito -top-3"
      style={{ fontWeight: 450 }}>
      TATTOO
    </span>
    <span className="relative z-4 font-script text-xl">
      Искусство на твоей жизни
    </span>
  </div>
))
Hero.displayName = 'Hero';