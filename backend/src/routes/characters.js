const express = require('express');
const { createCharacter, getCharacters, getCharacter, updateCharacter, deleteCharacter } = require('../controllers/characterController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);
router.post('/', createCharacter);
router.get('/', getCharacters);
router.get('/:id', getCharacter);
router.put('/:id', updateCharacter);
router.delete('/:id', deleteCharacter);

module.exports = router;
