// PM2 ecosystem config for production optimization
module.exports = {
  apps: [{
    name: 'afrigenomix',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 1, // Single instance to conserve processes
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '300M', // Restart if exceeds 300MB
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
  }],
};
