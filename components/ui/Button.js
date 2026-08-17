"use client";

import Link from "next/link";

const BASE =
  "group inline-flex items-center justify-center gap-2.5 rounded-full font-bold transition-transform hover:scale-[1.03] active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/50";

const VARIANTS = {
  primary: "bg-brand text-neutral-900 shadow-lg shadow-brand/25",
  outline: "text-ink ring-1 ring-line hover:bg-ink/5",
};

const SIZES = {
  md: "px-6 py-3.5 text-base",
  lg: "px-8 py-4 text-base",
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
