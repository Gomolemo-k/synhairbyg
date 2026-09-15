type ProductArtProps = {
  from: string;
  to: string;
  name: string;
  className?: string;
};

export function WigSilhouette() {
  return (
    <g>
      <path
        d="M190,58
           C262,58 312,106 312,178
           C312,240 300,280 316,342
           C330,410 362,442 377,470
           C332,456 300,456 275,470
           C254,420 218,400 198,400
           C116,400 78,330 84,248
           C88,178 142,58 190,58 Z"
        fill="currentColor"
        opacity="0.92"
      />
      <path
        d="M92,232
           C106,148 170,106 222,118
           C200,134 168,164 164,200
           C140,216 110,226 92,232 Z"
        fill="currentColor"
        opacity="0.75"
      />
      <path
        d="M132,300 C170,268 220,256 262,258"
        stroke="#fff9f7"
        strokeOpacity="0.35"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M120,360 C170,322 240,312 292,324"
        stroke="#fff9f7"
        strokeOpacity="0.22"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M232,240 C280,250 306,286 310,330"
        stroke="#fff9f7"
        strokeOpacity="0.3"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

export function Sparkle({ x, y, s = 10 }: { x: number; y: number; s?: number }) {
  return (
    <g>
      <path
        d={`M${x},${y - s} C${x + s * 0.3},${y - s * 0.3} ${x + s * 0.3},${y + s * 0.3} ${x},${y + s} C${x - s * 0.3},${y + s * 0.3} ${x - s * 0.3},${y - s * 0.3} ${x},${y - s} Z`}
        fill="#c9a46c"
      />
      <path
        d={`M${x - s},${y} C${x - s * 0.3},${y - s * 0.3} ${x + s * 0.3},${y - s * 0.3} ${x + s},${y} C${x + s * 0.3},${y + s * 0.3} ${x - s * 0.3},${y + s * 0.3} ${x - s},${y} Z`}
        fill="#c9a46c"
      />
    </g>
  );
}

export default function ProductArt({
  from,
  to,
  name,
  className,
}: ProductArtProps) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
    >
      <svg
        viewBox="0 0 400 500"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <circle cx="330" cy="70" r="180" fill="#fff9f7" opacity="0.1" />
        <circle cx="52" cy="430" r="130" fill="#fff9f7" opacity="0.08" />
        <circle cx="200" cy="500" r="190" fill="#211a1c" opacity="0.18" />
        <Sparkle x={88} y={96} s={8} />
        <Sparkle x={322} y={286} s={6} />
        <Sparkle x={150} y={452} s={7} />
        <WigSilhouette />
      </svg>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
        <span className="font-display text-4xl italic tracking-wide text-warmwhite/70">
          {initials}
        </span>
        <span className="mb-1 hidden text-[10px] font-semibold uppercase tracking-[0.25em] text-warmwhite/60 sm:block">
          SynHairbyG
        </span>
      </div>
    </div>
  );
}