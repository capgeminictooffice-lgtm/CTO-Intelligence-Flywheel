/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // pdf-parse ships CJS and reads test files at import time — bundling it with
  // Next.js webpack breaks the production build. Mark it external so it's
  // loaded at runtime from node_modules instead. Same for pdfjs-dist (pulled in
  // by pdf-parse), @anthropic-ai/sdk (heavy, no need to bundle), and openai.
  experimental: {
    serverComponentsExternalPackages: [
      "pdf-parse",
      "pdfjs-dist",
      "@anthropic-ai/sdk",
      "openai",
    ],
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      // pdf-parse references a sample file via fs at import time. Tell webpack
      // to treat it as a require()'d module, not to try to inline it.
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push("pdf-parse");
      }
    }
    return config;
  },
};

module.exports = nextConfig;
