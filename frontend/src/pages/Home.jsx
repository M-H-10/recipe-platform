import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecipes } from '../api';
import toast from 'react-hot-toast';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const { data } = await getRecipes({ search, category });
      setRecipes(data);
    } catch {
      toast.error('Failed to load recipes');
    }
    setLoading(false);
  };

  useEffect(() => { fetchRecipes(); }, []);

  return (
    <div className="home">
      <div className="hero">
        <h1>🍳 Recipe Platform</h1>
        <p>Discover and share amazing recipes</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or ingredient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="dessert">Dessert</option>
          <option value="snack">Snack</option>
        </select>
        <button onClick={fetchRecipes}>Search</button>
      </div>

      {loading ? (
        <div className="loading">Loading recipes...</div>
      ) : recipes.length === 0 ? (
        <div className="empty">
          <p>No recipes found. Be the first to add one!</p>
          <Link to="/add-recipe">Add Recipe</Link>
        </div>
      ) : (
        <div className="recipes-grid">
          {recipes.map(recipe => (
            <Link to={`/recipe/${recipe._id}`} key={recipe._id} className="recipe-card">
              {recipe.image && <img src={recipe.image} alt={recipe.title} />}
              {!recipe.image && <div className="recipe-placeholder">🍽️</div>}
              <div className="recipe-info">
                <h3>{recipe.title}</h3>
                <p>{recipe.description.substring(0, 80)}...</p>
                <div className="recipe-meta">
                  <span>⏱️ {recipe.cookingTime} min</span>
                  <span>⭐ {recipe.averageRating.toFixed(1)}</span>
                  <span className="category">{recipe.category}</span>
                </div>
                <small>by {recipe.author?.username}</small>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;