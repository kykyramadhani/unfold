// Flat vector characters for the card cover.
// Solid fills only, no gradients. Each one has a darker shape behind the body
// for depth plus a big cartoon face. The outlines are smooth closed curves so
// they stay clean at any size.
//
// Every character takes `body`, `shade` and `ink` colors, so one shape can be
// reused by several decks:
//   <BlobShocked className="size-56" body="#8B7BF7" />

const FACE_WHITE = "#FFFFFF";

/** Big cartoon eyes with highlights. */
function Eyes({ cx = 100, cy = 96, spread = 26, r = 20, ink, pupil = 9, look = 0 }) {
  return (
    <>
      {[-1, 1].map((side) => (
        <g key={side}>
          <ellipse cx={cx + side * spread} cy={cy} rx={r} ry={r * 1.08} fill={FACE_WHITE} />
          <circle cx={cx + side * spread + look} cy={cy + 3} r={pupil} fill={ink} />
          <circle cx={cx + side * spread + look - 4} cy={cy - 2} r={pupil * 0.32} fill={FACE_WHITE} />
        </g>
      ))}
    </>
  );
}

const BLOB_SHADE =
  "M100.0 22.0C116.1 20.0 142.5 26.9 153.4 38.3C164.3 49.7 163.8 73.7 165.5 90.5C167.1 107.2 169.5 123.6 163.4 138.6C157.3 153.7 143.5 175.4 128.7 180.8C113.9 186.2 90.6 178.1 74.8 171.3C59.0 164.5 42.4 154.0 33.8 140.2C25.2 126.4 19.3 103.4 23.1 88.4C26.9 73.4 43.8 61.3 56.6 50.3C69.4 39.2 83.9 24.0 100.0 22.0Z";
const BLOB_BODY =
  "M100.0 30.0C114.5 28.2 138.3 34.4 148.1 44.7C157.9 55.0 157.4 76.6 158.9 91.6C160.4 106.7 162.6 121.4 157.1 134.9C151.5 148.5 139.1 168.0 125.8 172.9C112.5 177.8 91.5 170.5 77.3 164.4C63.1 158.3 48.2 148.8 40.4 136.4C32.7 124.0 27.3 103.3 30.8 89.8C34.2 76.3 49.4 65.4 60.9 55.4C72.5 45.5 85.5 31.8 100.0 30.0Z";

/** Round lopsided blob with raised brows and an open mouth. Looks shocked. */
export function BlobShocked({ className, body = "#8B7BF7", shade = "#6F5DE0", ink = "#2A2140" }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden focusable="false">
      <path d={BLOB_SHADE} fill={shade} />
      <path d={BLOB_BODY} fill={body} />
      {/* raised brows */}
      <path
        d="M62 66c6-7 18-8 25-3"
        stroke={ink}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      <path
        d="M113 63c7-5 19-4 25 3"
        stroke={ink}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      <Eyes cy={100} spread={27} r={21} ink={ink} />
      <ellipse cx="100" cy="146" rx="14" ry="17" fill={ink} />
      <ellipse cx="100" cy="153" rx="7" ry="8" fill="#F4607C" />
    </svg>
  );
}

/**
 * One open hand: a rounded palm with four short fingers. Drawn twice, once
 * fat in the outline color and once on top in the fill, so the seams where
 * the fingers meet the palm do not show.
 */
function Hand({ fill, line }) {
  const shapes = (
    <>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={3 + i * 11} y="0" width="11" height="22" rx="5.5" />
      ))}
      <rect x="0" y="14" width="47" height="34" rx="16" />
    </>
  );
  return (
    <>
      <g fill={line} stroke={line} strokeWidth="8" strokeLinejoin="round">
        {shapes}
      </g>
      <g fill={fill}>{shapes}</g>
    </>
  );
}

/** Warm blob with closed smiling eyes and two open hands. Reads as a hug. */
export function BlobHug({ className, body = "#FF8B6B", shade = "#EE6E4C", ink = "#3D170C" }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden focusable="false">
      <path d={BLOB_SHADE} fill={shade} />
      <path d={BLOB_BODY} fill={body} />
      {/* closed eyes, curving up so they read as smiling */}
      <path d="M60 100c7-11 21-11 28 0" stroke={ink} strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M112 100c7-11 21-11 28 0" stroke={ink} strokeWidth="7" strokeLinecap="round" fill="none" />
      <ellipse cx="66" cy="126" rx="10" ry="6" fill="#F4607C" opacity="0.45" />
      <ellipse cx="134" cy="126" rx="10" ry="6" fill="#F4607C" opacity="0.45" />
      {/* soft open smile */}
      <path d="M80 130c6 14 34 14 40 0" stroke={ink} strokeWidth="7" strokeLinecap="round" fill="none" />
      {/* hands last so they sit in front, one mirrored for the other side */}
      <g transform="translate(2 104) rotate(-20)">
        <Hand fill={body} line={shade} />
      </g>
      <g transform="translate(200 0) scale(-1 1)">
        <g transform="translate(2 104) rotate(-20)">
          <Hand fill={body} line={shade} />
        </g>
      </g>
    </svg>
  );
}


const SQUIG_SHADE =
  "M100.0 24.0C107.1 23.0 115.1 18.5 122.1 19.4C129.2 20.2 135.3 25.8 142.1 29.0C149.0 32.2 156.9 34.3 163.3 38.7C169.7 43.1 178.3 48.3 180.7 55.4C183.1 62.5 178.7 73.5 177.5 81.2C176.3 89.0 172.8 94.9 173.4 102.0C174.0 109.1 180.4 116.2 181.2 123.8C182.1 131.3 181.6 140.6 178.3 147.2C175.0 153.8 167.1 158.2 161.5 163.5C155.8 168.7 150.8 175.2 144.3 178.7C137.7 182.2 129.4 184.7 122.1 184.3C114.7 183.9 107.1 177.5 100.0 176.4C92.9 175.3 87.5 176.7 79.7 177.8C71.9 178.9 60.7 184.7 53.3 182.8C46.0 181.0 39.5 173.2 35.4 166.6C31.2 160.1 31.0 150.6 28.2 143.5C25.3 136.3 19.6 130.8 18.2 123.9C16.9 117.0 18.8 108.9 20.3 102.0C21.7 95.1 26.7 89.9 27.1 82.5C27.5 75.0 21.9 65.5 22.6 57.3C23.2 49.1 25.0 37.6 31.0 33.0C37.0 28.5 50.4 31.3 58.4 30.0C66.5 28.8 72.6 26.5 79.5 25.5C86.4 24.5 92.9 25.0 100.0 24.0Z";
const SQUIG_BODY =
  "M100.0 31.8C106.4 30.9 113.6 26.9 119.9 27.6C126.2 28.4 131.8 33.4 137.9 36.3C144.1 39.2 151.2 41.1 156.9 45.1C162.7 49.0 170.5 53.7 172.6 60.1C174.8 66.4 170.9 76.3 169.8 83.3C168.7 90.3 165.5 95.6 166.1 102.0C166.6 108.4 172.4 114.8 173.1 121.6C173.9 128.4 173.5 136.8 170.5 142.7C167.5 148.7 160.4 152.6 155.3 157.3C150.2 162.0 145.8 167.9 139.9 171.0C133.9 174.2 126.5 176.4 119.9 176.1C113.2 175.7 106.4 169.9 100.0 168.9C93.6 168.0 88.7 169.3 81.7 170.2C74.7 171.2 64.7 176.4 58.0 174.7C51.4 173.1 45.6 166.1 41.8 160.2C38.0 154.3 37.9 145.7 35.4 139.3C32.8 132.9 27.6 127.9 26.4 121.7C25.2 115.5 26.9 108.2 28.2 102.0C29.6 95.8 34.0 91.1 34.4 84.4C34.7 77.7 29.7 69.2 30.3 61.8C30.9 54.4 32.5 44.0 37.9 39.9C43.3 35.8 55.3 38.3 62.6 37.2C69.9 36.1 75.3 34.0 81.5 33.1C87.8 32.2 93.6 32.7 100.0 31.8Z";

/** Wobbly square with a wide grin. The loud happy one. */
export function SquiggleGrin({ className, body = "#F97C51", shade = "#E2603A", ink = "#3A2016" }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden focusable="false">
      {/* tufts sit behind the body so they peek over the top edge */}
      <path d="M60 54 76 8 96 52Z" fill={shade} />
      <path d="M140 54 124 8 104 52Z" fill={shade} />
      <path d={SQUIG_SHADE} fill={shade} />
      <path d={SQUIG_BODY} fill={body} />
      <Eyes cy={94} spread={25} r={20} ink={ink} />
      {/* open grin */}
      <path d="M72 132c8 20 48 20 56 0-14 6-42 6-56 0Z" fill={ink} />
      <path d="M86 136c5 1 23 1 28 0-2 8-26 8-28 0Z" fill="#F4607C" />
    </svg>
  );
}

const BURST_SHADE =
  "M100.0 16.0C109.7 16.0 116.6 44.6 129.0 51.8C141.4 58.9 169.6 50.6 174.5 59.0C179.3 67.4 158.0 87.7 158.0 102.0C158.0 116.3 179.3 136.6 174.5 145.0C169.6 153.4 141.4 145.1 129.0 152.2C116.6 159.4 109.7 188.0 100.0 188.0C90.3 188.0 83.4 159.4 71.0 152.2C58.6 145.1 30.4 153.4 25.5 145.0C20.7 136.6 42.0 116.3 42.0 102.0C42.0 87.7 20.7 67.4 25.5 59.0C30.4 50.6 58.6 58.9 71.0 51.8C83.4 44.6 90.3 16.0 100.0 16.0Z";
const BURST_BODY =
  "M100.0 24.6C108.7 24.6 114.9 50.3 126.1 56.8C137.3 63.2 162.7 55.8 167.0 63.3C171.4 70.8 152.2 89.1 152.2 102.0C152.2 114.9 171.4 133.2 167.0 140.7C162.7 148.2 137.3 140.8 126.1 147.2C114.9 153.7 108.7 179.4 100.0 179.4C91.3 179.4 85.1 153.7 73.9 147.2C62.7 140.8 37.3 148.2 33.0 140.7C28.6 133.2 47.8 114.9 47.8 102.0C47.8 89.1 28.6 70.8 33.0 63.3C37.3 55.8 62.7 63.2 73.9 56.8C85.1 50.3 91.3 24.6 100.0 24.6Z";

/** Six point star with a wink and a blush. */
export function BurstWink({ className, body = "#FFCE4F", shade = "#F0B227", ink = "#3B2A08" }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden focusable="false">
      <path d={BURST_SHADE} fill={shade} />
      <path d={BURST_BODY} fill={body} />
      {/* open eye */}
      <ellipse cx="80" cy="96" rx="18" ry="19" fill={FACE_WHITE} />
      <circle cx="82" cy="99" r="8" fill={ink} />
      <circle cx="78" cy="94" r="3" fill={FACE_WHITE} />
      {/* wink */}
      <path
        d="M110 98c6-9 18-9 24 0"
        stroke={ink}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="62" cy="124" rx="10" ry="6" fill="#F4607C" opacity="0.55" />
      <ellipse cx="140" cy="124" rx="10" ry="6" fill="#F4607C" opacity="0.55" />
      <path
        d="M84 132c8 11 26 11 34 0"
        stroke={ink}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export const CHARACTERS = {
  blob: BlobShocked,
  hug: BlobHug,
  squiggle: SquiggleGrin,
  burst: BurstWink,
};
