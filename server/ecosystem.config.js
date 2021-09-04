module.exports = {
  apps : [{
    name: 'spotify-liked-api',
    script: './server.js',
  }, {
    name: 'spotify-liked-worker',
    script: './jobs/worker.js',
    instances: 1
  }]
};
