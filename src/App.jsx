import { useState } from 'react';
import ActorCard from './components/ActorCard';
import { actors } from './data/actors';
import './App.css';

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedActors, setLikedActors] = useState([]);
  const [passedActors, setPassedActors] = useState([]);

  const handleSwipe = (direction) => {
    if (currentIndex >= actors.length) return;

    const currentActor = actors[currentIndex];
    
    if (direction === 'right') {
      setLikedActors([...likedActors, currentActor]);
    } else {
      setPassedActors([...passedActors, currentActor]);
    }

    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
    }, 250);
  };

  const handleLike = () => {
    handleSwipe('right');
  };

  const handlePass = () => {
    handleSwipe('left');
  };

  const resetApp = () => {
    setCurrentIndex(0);
    setLikedActors([]);
    setPassedActors([]);
  };

  const visibleCards = actors.slice(currentIndex, currentIndex + 3);
  const isFinished = currentIndex >= actors.length;

  return (
    <div className="app">
      <div className="app-header">
        <h1>演员配对</h1>
        <div className="stats">
          <span className="liked-count">❤️ {likedActors.length}</span>
          <span className="passed-count">👎 {passedActors.length}</span>
        </div>
      </div>

      <div className="card-container">
        {isFinished ? (
          <div className="finished-message">
            <h2>暂时就这些了！</h2>
            <p>您喜欢了 {likedActors.length} 位演员</p>
            <button className="reset-button" onClick={resetApp}>
              重新开始
            </button>
          </div>
        ) : (
          <>
            {visibleCards.map((actor, idx) => (
              <ActorCard
                key={actor.id}
                actor={actor}
                onSwipe={handleSwipe}
                index={idx}
              />
            ))}
          </>
        )}
      </div>

      {!isFinished && (
        <div className="action-buttons">
          <button className="pass-button" onClick={handlePass}>
            <span className="button-icon">✕</span>
          </button>
          <button className="like-button" onClick={handleLike}>
            <span className="button-icon">♥</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

