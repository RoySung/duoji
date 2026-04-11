//@ts-check

const { composePlugins, withNx } = require('@nx/next');

// Get repository name from package.json or environment variable
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  output: 'export',
  env: {
    NEXT_PUBLIC_PROJECT_ROOT: __dirname,
  },
  basePath: process.env.NODE_ENV === 'production' && repo ? `/${repo}` : '',
  assetPrefix: process.env.NODE_ENV === 'production' && repo ? `/${repo}/` : '',
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
