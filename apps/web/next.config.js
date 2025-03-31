//@ts-check

const { composePlugins, withNx } = require('@nx/next');

// Get repository name from package.json or environment variable
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'duoji';

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? `/${repo}` : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? `/${repo}/` : '',
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
