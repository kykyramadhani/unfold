"use client";

import Link from "next/link";

const BASE =
  "group inline-flex items-center justify-center gap-2 rounded-full text-[15px] font-bold transition-transform hover:scale-[1.03] active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-ink/30";

const VARIANTS = {
  primary: "bg-ink text-white",
  outline: "border border-line bg-white text-ink",
};

const SIZES = {
  md: "h-14 px-7",
  lg: "h-16 px-9",
};

/** One pill button for both links and buttons. Pass `href` to get a link. */
export default function Button({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const cls = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
  return href ? (
    <Link href={href} className={cls} {...props}>
      {children}
    </Link>
  ) : (
    <button type="button" className={cls} {...props}>
      {children}
    </button>
  );
}
