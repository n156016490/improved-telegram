/**
 * PM2 ecosystem file for Louaab
 * Adjust `script` to point to your custom server file (server.js) if needed.
 */
/**
 * PM2 ecosystem file for Louaab
 * Adjust `script` to point to your custom server file (server.js) if needed.
 * To start in production: pm2 start ecosystem.config.js --env production
 */
module.exports = {
  apps: [
    {
      name: 'louaab',
      script: 'server.js', // or './server.js' or path to your custom server
      instances: 1,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
