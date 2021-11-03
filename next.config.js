const { join } = require('path');

require('./envLoader');

const workspace = join(__dirname, '..');

module.exports = {
  target: 'serverless',
  env: {
    RPC_URL: process.env.RPC_URL,
    CHAIN_ID: process.env.CHAIN_ID,
    SUPABASE_URL:process.env.SUPABASE_URL, 
    SUPABASE_KEY:process.env.SUPABASE_KEY
  },
  poweredByHeader: false,
  webpack: (config, options) => {
    /** Allows import modules from packages in workspace. */
    //config.externals = { ...config.externals, electron: 'electron' };
    config.module = {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.(js|jsx|ts|tsx)$/,
          include: [workspace],
          exclude: /node_modules/,
          use: options.defaultLoaders.babel,
        },
      ],
    };
    return config;
  },
};
