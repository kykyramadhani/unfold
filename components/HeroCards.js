// The stack of three cards on the home page, built from plain shapes.
// Two sizes: the desktop one (605x706) and the phone one (346x273). Each
// card sits in a box that is as big as its rotated bounds, like in Figma.

function Spin({ box, deg, children }) {
  const [left, top, width, height] = box;
  return (
    <div className="absolute flex items-center justify-center" style={{ left, top, width, height }}>
      <div className="flex-none" style={{ transform: `rotate(${deg}deg)` }}>
        {children}
      </div>
    </div>
  );
}

const label = "absolute text-[12px] font-bold leading-[18px] tracking-[1.2px]";

export function HeroCardsDesktop() {
  return (
    <div className="relative h-[706px] w-[605px]" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/figma/halo-yellow.svg" alt="" className="absolute top-[83px] left-[97px] size-[457px]" />

      <Spin box={[-47.37, 102, 467.206, 544.222]} deg={17}>
        <div className="relative h-[463px] w-[347px] rounded-[28px] bg-peach text-ink">
          <p className={`${label} top-[29px] left-[28px]`}>UNFOLD / CONNECTION</p>
          <p className="absolute top-[343px] left-[255px] text-[67px]">✦</p>
        </div>
      </Spin>

      <Spin box={[145, -20.18, 451.63, 549.804]} deg={-13}>
        <div className="relative h-[483px] w-[352px] rounded-[29px] bg-lavender">
          <p className="absolute top-[77px] left-[35px] w-[280px] font-display text-[42px] leading-[53px] font-semibold text-ink">
            A little closer
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/figma/ornament-indigo.svg" alt="" className="absolute top-[17px] left-[316px] size-[13px] rotate-[13deg]" />
        </div>
      </Spin>

      <Spin box={[84.17, 135, 400.465, 509.55]} deg={5}>
        <div className="relative h-[480px] w-[360px] rounded-[30px] bg-ink">
          <p className={`${label} top-[32px] left-[33px] whitespace-pre text-lavender`}>{"UNFOLD   /   CARD 017"}</p>
          <div className="absolute top-[75px] left-[33px] h-px w-[294px] bg-[#75618a]" />
          <p className="absolute top-[108px] left-[34px] text-[65px] text-peach">✦</p>
          <p className="absolute top-[193px] left-[35px] w-[288px] font-display text-[44px] leading-[54px] font-semibold text-white">
            When did you last feel truly understood?
          </p>
          <div className="absolute top-[392px] left-[35px] h-px w-[290px] bg-[#75618a]" />
          <p className={`${label} top-[414px] left-[35px] text-lavender`}>GO DEEPER</p>
          <p className={`${label} top-[414px] left-[264px] text-lavender`}>17 / 40</p>
        </div>
      </Spin>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/figma/ornament-peach.svg" alt="" className="absolute top-[502px] left-[36px] size-[23px]" />
    </div>
  );
}

export function HeroCardsMobile() {
  return (
    <div className="relative mx-auto h-[273px] w-[346px]" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/figma/warm-halo.svg" alt="" className="absolute top-[11px] left-[73px] size-[210px]" />

      <Spin box={[-18.82, 41, 249.938, 279.801]} deg={14}>
        <div className="h-[239px] w-[198px] rounded-[17px] bg-peach" />
      </Spin>

      <Spin box={[105, -24.66, 241.381, 271.787]} deg={-15}>
        <div className="h-[231px] w-[188px] rounded-[18px] bg-lavender" />
      </Spin>

      <Spin box={[62.89, 42, 205.651, 243.691]} deg={4}>
        <div className="relative h-[231px] w-[190px] rounded-[19px] bg-ink">
          <p className="absolute top-[18px] left-[18px] text-[10px] leading-[15px] font-bold tracking-[1.2px] whitespace-pre text-lavender">
            {"UNFOLD  /  017"}
          </p>
          <p className="absolute top-[55px] left-[17px] text-[34px] text-peach">✦</p>
          <p className="absolute top-[97px] left-[20px] w-[155px] font-display text-[24px] leading-[29px] font-semibold text-white">
            When did you last feel understood?
          </p>
          <p className="absolute top-[202px] left-[19px] text-[10px] leading-[15px] font-bold tracking-[1.2px] text-lavender">
            GO DEEPER
          </p>
        </div>
      </Spin>
    </div>
  );
}
