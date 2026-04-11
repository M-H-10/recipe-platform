import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipe, rateRecipe, deleteRecipe } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RecipeDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data } = await getRecipe(id);
        setRecipe(data);
        setTimer(data.cookingTime * 60);
      } catch {
        toast.error('Recipe not found');
        navigate('/');
      }
      setLoading(false);
    };
    fetchRecipe();
  }, [id]);

  useEffect(() => {
    let interval;
    if (timerActive && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && timerActive) {
      toast.success('Cooking time is up!');
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  const handleRate = async (score) => {
    if (!user) { toast.error('Please login to rate'); return; }
    try {
      const { data } = await rateRecipe(id, score);
      setRecipe(data);
      toast.success('Rating saved!');
    } catch {
      toast.error('Failed to rate');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this recipe?')) return;
    try {
      await deleteRecipe(id);
      toast.success('Recipe deleted');
      navigate('/');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!recipe) return null;

  return (
    <div className="recipe-detail">
      {recipe.image && <img src={recipe.image} alt={recipe.title} className="detail-image" />}
      <div className="detail-content">
        <div className="detail-header">
          <h1>{recipe.title}</h1>
          <div className="detail-meta">
            <span>⏱️ {recipe.cookingTime} min</span>
            <span>⭐ {recipe.averageRating.toFixed(1)}</span>
            <span className="category">{recipe.category}</span>
            <span>👨‍🍳 {recipe.author?.username}</span>
          </div>
        </div>

        <p className="description">{recipe.description}</p>

        <div className="timer-box">
          <h3>⏱️ Cooking Timer</h3>
          <div className="timer-display">{formatTime(timer)}</div>
          <div className="timer-buttons">
            <button onClick={() => setTimerActive(!timerActive)}>
              {timerActive ? 'Pause' : 'Start'}
            </button>
            <button onClick={() => { setTimer(recipe.cookingTime * 60); setTimerActive(false); }}>
              Reset
            </button>
          </div>
        </div>

        <div className="ingredients-box">
          <h3>🛒 Ingredients</h3>
          <ul>
            {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
          </ul>
        </div>

        <div className="instructions-box">
          <h3>📋 Instructions</h3>
          <p>{recipe.instructions}</p>
        </div>

        <div className="rating-box">
          <h3>⭐ Rate this Recipe</h3>
          <div className="stars">
            {[1,2,3,4,5].map(star => (
              <button key={star} onClick={() => handleRate(star)} className="star-btn">
                ⭐
              </button>
            ))}
          </div>
        </div>

        {user?.userId === recipe.author?._id && (
          <button onClick={handleDelete} className="delete-btn">
            🗑️ Delete Recipe
          </button>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;