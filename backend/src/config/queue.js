const { Queue } = require('bullmq');
const redis = require('./redis');

const videoQueue = new Queue('video-generation', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});

module.exports = { videoQueue };
