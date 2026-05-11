//@ts-check

const { composePlugins, withNx } = require('@nx/next');

function normalizeBasePath(value) {
  if (!value) {
    return '';
  }

  const trimmed = value.trim().replace(/^\/+|\/+$/g, '');

  return trimmed ? `/${trimmed}` : '';
}

const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  output: 'export',
  env: {
    NEXT_PUBLIC_PROJECT_ROOT: __dirname,
  },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : '',
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
