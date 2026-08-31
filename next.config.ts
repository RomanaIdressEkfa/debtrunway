import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Every route on this site is static, so Next writes plain HTML/CSS/JS to
   * `out/`. Cloudflare Pages serves that directly from its edge — no server,
   * no cold starts, nothing to keep running.
   */
  output: "export",

  /** Static hosts serve `/about/index.html`, so emit directories, not files. */
  trailingSlash: true,
};

export default nextConfig;
