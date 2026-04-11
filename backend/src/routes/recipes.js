const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const auth = require('../middleware/auth');

// Get all recipes
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { ingredients: { $elemMatch: { $regex: search, $options: 'i' } } }
      ];
    }

    if (category) query.category = category;

    const recipes = await Recipe.find(query)
      .populate('author', 'username')
      .sort({ createdAt: -1 });

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'username');
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create recipe
router.post('/', auth, async (req, res) => {
  try {
    const recipe = new Recipe({ ...req.body, author: req.user.userId });
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Rate recipe
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const existingRating = recipe.ratings.find(
      r => r.user.toString() === req.user.userId
    );

    if (existingRating) {
      existingRating.score = req.body.score;
    } else {
      recipe.ratings.push({ user: req.user.userId, score: req.body.score });
    }

    recipe.averageRating = recipe.ratings.reduce((acc, r) => acc + r.score, 0) / recipe.ratings.length;
    await recipe.save();

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete recipe
router.delete('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    if (recipe.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;