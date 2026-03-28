const express = require('express');
const { getVideos, getVideo } = require('../controllers/videoController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);
router.get('/', getVideos);
router.get('/:id', getVideo);

module.exports = router;
