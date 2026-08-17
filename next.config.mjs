/** @type {import('next').NextConfig} */
const nextConfig = {
  // An extra lockfile in ~/Documents makes Next pick the wrong project root.
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
