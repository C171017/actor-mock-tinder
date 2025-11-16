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
  const [showHeartExplosion, setShowHeartExplosion] = useState(false);
  const [echoEmojis, setEchoEmojis] = useState([]);

  const handleSwipe = (direction) => {
    if (currentIndex >= shuffledActors.length) return;

    const currentActor = shuffledActors[currentIndex];
    
    if (direction === 'right') {
      setLikedActors([...likedActors, currentActor]);
      // Trigger heart explosion after swipe completes
      setTimeout(() => {
        setShowHeartExplosion(true);
        // Hide after animation completes
        setTimeout(() => {
          setShowHeartExplosion(false);
        }, 1000);
        
        // Trigger echo effect - create multiple waves of emojis
        const waveCount = 6;
        const emojisPerWave = 2;
        const newEchoEmojis = [];
        
        for (let wave = 0; wave < waveCount; wave++) {
          for (let i = 0; i < emojisPerWave; i++) {
            newEchoEmojis.push({
              id: Date.now() + wave * 1000 + i,
              wave: wave,
              index: i,
              delay: wave * 0.12, // Stagger waves
              direction: i === 0 ? 'right' : 'left', // Alternate directions
            });
          }
        }
        
        setEchoEmojis(newEchoEmojis);
        
        // Clean up after animation completes
        setTimeout(() => {
          setEchoEmojis([]);
        }, 2000);
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

      {showHeartExplosion && (
        <div className="heart-explosion">{t('like')}</div>
      )}

      {echoEmojis.map((emoji) => (
        <div
          key={emoji.id}
          className={`echo-emoji echo-${emoji.direction}`}
          style={{
            animationDelay: `${emoji.delay}s`,
            top: `${25 + emoji.wave * 12}%`,
          }}
        >
          {t('like')}
        </div>
      ))}

    </div>
  );
}

export default App;

