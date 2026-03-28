const { Job } = require('../models');
const { addVideoJob } = require('../services/queueService');

exports.createJob = async (req, res) => {
  try {
    const { title, type, story, characters, settings } = req.body;
    if (!story) {
      return res.status(400).json({ error: { message: 'Story content is required' } });
    }

    const job = await Job.create({
      userId: req.user.id,
      title: title || 'Untitled Project',
      type: type || 'text_to_video',
      inputData: { story, characters, settings },
      status: 'pending',
      progress: 0,
    });

    // Add to processing queue
    await addVideoJob(job.id, {
      jobId: job.id,
      userId: req.user.id,
      story,
      characters,
      settings,
      type: job.type,
    });

    res.status(201).json({ job });
  } catch (err) {
    console.error('Create job error:', err);
    res.status(500).json({ error: { message: 'Failed to create job' } });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ error: { message: 'Failed to fetch jobs' } });
  }
};

exports.getJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!job) {
      return res.status(404).json({ error: { message: 'Job not found' } });
    }
    res.json({ job });
  } catch (err) {
    res.status(500).json({ error: { message: 'Failed to fetch job' } });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!job) {
      return res.status(404).json({ error: { message: 'Job not found' } });
    }
    await job.destroy();
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ error: { message: 'Failed to delete job' } });
  }
};
