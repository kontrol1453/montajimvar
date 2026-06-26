// PM2 config for Raspberry Pi
// Start: pm2 start ecosystem.config.js
// Save: pm2 save
// Auto-start on boot: pm2 startup

module.exports = {
  apps: [
    {
      name: "montajimvar-push",
      script: "server.js",
      cwd: __dirname,
      watch: false,
      env: {
        NODE_ENV: "production",
      },
      // Restart if memory exceeds 100MB
      max_memory_restart: "100M",
      // Log configuration
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "./logs/error.log",
      out_file: "./logs/output.log",
      merge_logs: true,
    },
  ],
};
