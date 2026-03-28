const { videoQueue } = require('../config/queue');

const addVideoJob = async (jobId, data) => {
  try {
    await videoQueue.add('generate-video', data, {
      jobId,
      removeOnComplete: true,
      removeOnFail: false,
    });
    console.log(`📥 Added job ${jobId} to video queue`);
  } catch (err) {
    console.error(`Failed to add job ${jobId} to queue:`, err);
    throw err;
  }
};

module.exports = { addVideoJob };
