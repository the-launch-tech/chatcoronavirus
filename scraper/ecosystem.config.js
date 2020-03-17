module.exports = {
  apps: [
    {
      name: 'scraper',
      script: './index.js',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
}
