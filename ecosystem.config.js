module.exports = {
  apps: [
    {
      name: 'beau-club',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
      instances: 'max', // استفاده از تمام CPU cores
      exec_mode: 'cluster',
      max_memory_restart: '1G',
    },
  ],
};
