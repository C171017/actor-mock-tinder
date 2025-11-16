import { useState } from 'react';
import ActorCard from './components/ActorCard';
import { actors } from './data/actors';
import ControlBar from './components/ControlBar';
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
  const [showBigHeart, setShowBigHeart] = useState(false);
  const [fallingEmojis, setFallingEmojis] = useState([]);

  const handleSwipe = (direction) => {
    if (currentIndex >= shuffledActors.length) return;

    const currentActor = shuffledActors[currentIndex];
    
      if (direction === 'right') {
      setLikedActors([...likedActors, currentActor]);
      // Trigger big heart and falling emojis after swipe completes
      setTimeout(() => {
        // Show big heart that blows up and fades
        setShowBigHeart(true);
        setTimeout(() => {
          setShowBigHeart(false);
        }, 1500);
        
        // Create falling emojis like rain
        const emojiTypes = ['🥰', '💋', '🔥'];
        const emojiCount = 30;
        const newFallingEmojis = [];
        
        for (let i = 0; i < emojiCount; i++) {
          newFallingEmojis.push({
            id: Date.now() + i,
            emoji: emojiTypes[Math.floor(Math.random() * emojiTypes.length)],
            left: Math.random() * 100, // Random horizontal position
            delay: Math.random() * 0.5, // Random delay for staggered effect
            duration: 2 + Math.random() * 1, // Random fall duration (2-3 seconds)
          });
        }
        
        setFallingEmojis(newFallingEmojis);
        
        // Clean up after animation completes
        setTimeout(() => {
          setFallingEmojis([]);
        }, 4000);
      }, 250);
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

      <ControlBar 
        likedCount={likedActors.length}
        passedCount={passedActors.length}
      />

      {showBigHeart && (
        <div className="big-heart">{t('like')}</div>
      )}

      {fallingEmojis.map((item) => (
        <div
          key={item.id}
          className="falling-emoji"
          style={{
            left: `${item.left}%`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
          }}
        >
          {item.emoji}
        </div>
      ))}

    </div>
  );
}

export default App;

