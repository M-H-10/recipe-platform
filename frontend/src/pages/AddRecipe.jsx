import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRecipe } from '../api';
import toast from 'react-hot-toast';

const AddRecipe = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    cookingTime: '',
    category: 'lunch',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const recipeData = {
        ...form,
        cookingTime: Number(form.cookingTime),
        ingredients: form.ingredients.split('\n').filter(i => i.trim())
      };
      await createRecipe(recipeData);
      toast.success('Recipe added successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add recipe');
    }
    setLoading(false);
  };

  return (
    <div className="add-recipe">
      <h2>🍳 Add New Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Recipe Title</label>
          <input
            type="text"
            placeholder="e.g. Spaghetti Carbonara"
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Brief description of the recipe..."
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Ingredients (one per line)</label>
          <textarea
            placeholder="200g pasta&#10;2 eggs&#10;100g cheese"
            value={form.ingredients}
            onChange={(e) => setForm({...form, ingredients: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Instructions</label>
          <textarea
            placeholder="Step by step instructions..."
            value={form.instructions}
            onChange={(e) => setForm({...form, instructions: e.target.value})}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Cooking Time (minutes)</label>
            <input
              type="number"
              placeholder="30"
              value={form.cookingTime}
              onChange={(e) => setForm({...form, cookingTime: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({...form, category: e.target.value})}
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="dessert">Dessert</option>
              <option value="snack">Snack</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Image URL (optional)</label>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={form.image}
            onChange={(e) => setForm({...form, image: e.target.value})}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Recipe'}
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;