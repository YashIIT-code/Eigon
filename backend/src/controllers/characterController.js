const { Character } = require('../models');

exports.createCharacter = async (req, res) => {
  try {
    const { name, traits, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: { message: 'Character name is required' } });
    }
    const character = await Character.create({
      userId: req.user.id,
      name,
      traits: traits || {},
      description: description || '',
    });
    res.status(201).json({ character });
  } catch (err) {
    console.error('Create character error:', err);
    res.status(500).json({ error: { message: 'Failed to create character' } });
  }
};

exports.getCharacters = async (req, res) => {
  try {
    const characters = await Character.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json({ characters });
  } catch (err) {
    res.status(500).json({ error: { message: 'Failed to fetch characters' } });
  }
};

exports.getCharacter = async (req, res) => {
  try {
    const character = await Character.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!character) {
      return res.status(404).json({ error: { message: 'Character not found' } });
    }
    res.json({ character });
  } catch (err) {
    res.status(500).json({ error: { message: 'Failed to fetch character' } });
  }
};

exports.updateCharacter = async (req, res) => {
  try {
    const character = await Character.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!character) {
      return res.status(404).json({ error: { message: 'Character not found' } });
    }
    const { name, traits, description } = req.body;
    await character.update({ name, traits, description });
    res.json({ character });
  } catch (err) {
    res.status(500).json({ error: { message: 'Failed to update character' } });
  }
};

exports.deleteCharacter = async (req, res) => {
  try {
    const character = await Character.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!character) {
      return res.status(404).json({ error: { message: 'Character not found' } });
    }
    await character.destroy();
    res.json({ message: 'Character deleted' });
  } catch (err) {
    res.status(500).json({ error: { message: 'Failed to delete character' } });
  }
};
