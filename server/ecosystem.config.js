module.exports = {
  apps : [{
    name: 'spotify-liked-api',
    script: './build/server.js',
  }, {
    name: 'spotify-liked-worker',
    script: './build/jobs/worker.js',
    instances: 4
  }]
};
