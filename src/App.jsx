import { useState } from 'react';
import ActorCard from './components/ActorCard';
import { actors } from './data/actors';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useTranslation } from './hooks/useTranslation';
import './App.css';

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

function App() {
  const { t } = useTranslation();
  const [shuffledActors, setShuffledActors] = useState(() => shuffleArray(actors));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedActors, setLikedActors] = useState([]);
  const [passedActors, setPassedActors] = useState([]);

  const handleSwipe = (direction) => {
    if (currentIndex >= shuffledActors.length) return;

    const currentActor = shuffledActors[currentIndex];
    
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
    setShuffledActors(shuffleArray(actors));
    setCurrentIndex(0);
    setLikedActors([]);
    setPassedActors([]);
  };

  const visibleCards = shuffledActors.slice(currentIndex, currentIndex + 3);
  const isFinished = currentIndex >= shuffledActors.length;

  return (
    <div className="app">
      <div className="app-header">
        <h1>{t('header')}</h1>
        <div className="stats">
          <span className="liked-count">{t('liked')} {likedActors.length}</span>
          <span className="passed-count">{t('passed')} {passedActors.length}</span>
          <LanguageSwitcher />
        </div>
      </div>

      <div className="card-container">
        {isFinished ? (
          <div className="finished-message">
            <h2>{t('finished')}</h2>
            <p>{t('finishedMessage', { count: likedActors.length })}</p>
            <button className="reset-button" onClick={resetApp}>
              {t('reset')}
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

    </div>
  );
}

export default App;

