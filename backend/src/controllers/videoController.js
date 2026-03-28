const { Job } = require('../models');

exports.getVideos = async (req, res) => {
  try {
    const videos = await Job.findAll({
      where: { userId: req.user.id, status: 'completed' },
      attributes: ['id', 'title', 'outputUrl', 'thumbnailUrl', 'duration', 'createdAt', 'metadata'],
      order: [['createdAt', 'DESC']],
    });
    res.json({ videos });
  } catch (err) {
    res.status(500).json({ error: { message: 'Failed to fetch videos' } });
  }
};

exports.getVideo = async (req, res) => {
  try {
    const video = await Job.findOne({
      where: { id: req.params.id, userId: req.user.id, status: 'completed' },
    });
    if (!video) {
      return res.status(404).json({ error: { message: 'Video not found' } });
    }
    res.json({ video });
  } catch (err) {
    res.status(500).json({ error: { message: 'Failed to fetch video' } });
  }
};
