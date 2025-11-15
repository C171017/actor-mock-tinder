import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import './ActorCard.css';

const ActorCard = ({ actor, onSwipe, index }) => {
  const { t, lang } = useTranslation();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageSwiping, setIsImageSwiping] = useState(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const currentPosRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const cardRef = useRef(null);

  const images = actor.images || [actor.image].filter(Boolean);

  useEffect(() => {
    setPosition({ x: 0, y: 0 });
    setRotation(0);
    setIsDragging(false);
    setCurrentImageIndex(0);
    setIsImageSwiping(false);
    isDraggingRef.current = false;
  }, [actor.id]);

  const handleStart = (clientX, clientY, isImageArea = false) => {
    startPosRef.current = { x: clientX, y: clientY };
    currentPosRef.current = { x: clientX, y: clientY };
    isDraggingRef.current = true;
    setIsDragging(true);
    setIsImageSwiping(isImageArea && images.length > 1);
  };

  const handleMove = (clientX, clientY) => {
    if (!isDraggingRef.current) return;

    currentPosRef.current = { x: clientX, y: clientY };
    const deltaX = clientX - startPosRef.current.x;
    const deltaY = clientY - startPosRef.current.y;

    // If swiping images, don't move the card
    if (isImageSwiping) {
      return;
    }

    setPosition({ x: deltaX, y: deltaY });
    // Smoother rotation with resistance
    const rotationAmount = Math.min(Math.max(deltaX * 0.08, -15), 15);
    setRotation(rotationAmount);
  };

  const handleEnd = () => {
    if (!isDraggingRef.current) return;
    
    // Calculate actual delta from refs (more reliable than state)
    const deltaX = currentPosRef.current.x - startPosRef.current.x;
    const deltaY = currentPosRef.current.y - startPosRef.current.y;
    
    if (isImageSwiping) {
      // Handle image swiping
      const threshold = 50;
      
      if (Math.abs(deltaX) > threshold) {
        if (deltaX < 0 && currentImageIndex < images.length - 1) {
          // Swipe left - next image (like Tinder)
          setCurrentImageIndex(currentImageIndex + 1);
        } else if (deltaX > 0 && currentImageIndex > 0) {
          // Swipe right - previous image
          setCurrentImageIndex(currentImageIndex - 1);
        }
      }
      
      setIsImageSwiping(false);
    } else {
      // Handle card swiping
      const threshold = 80;
      if (Math.abs(deltaX) > threshold) {
        const direction = deltaX > 0 ? 'right' : 'left';
        // Animate card off screen smoothly
        const exitX = deltaX > 0 ? window.innerWidth + 100 : -window.innerWidth - 100;
        const exitY = deltaY * 0.5; // Add some vertical movement for natural feel
        setPosition({ x: exitX, y: exitY });
        setRotation(deltaX > 0 ? 25 : -25);
        setTimeout(() => {
          onSwipe(direction);
        }, 250);
      } else {
        // Snap back with smooth spring animation
        setPosition({ x: 0, y: 0 });
        setRotation(0);
      }
    }
    
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    const isImageArea = e.target.tagName === 'IMG' || e.target.closest('.card-image');
    handleStart(e.clientX, e.clientY, isImageArea);
  };

  const handleImageMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    handleStart(e.clientX, e.clientY, true);
  };

  const handleMouseMove = (e) => {
    if (isDraggingRef.current) {
      handleMove(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const isImageArea = e.target.tagName === 'IMG' || e.target.closest('.card-image');
    handleStart(touch.clientX, touch.clientY, isImageArea);
  };

  const handleImageTouchStart = (e) => {
    e.stopPropagation();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY, true);
  };

  const handleTouchMove = (e) => {
    if (isDraggingRef.current) {
      e.preventDefault(); // Prevent scrolling while dragging
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  useEffect(() => {
    const handleMouseMoveWrapper = (e) => {
      if (isDraggingRef.current) {
        handleMove(e.clientX, e.clientY);
      }
    };

    const handleMouseUpWrapper = () => {
      handleEnd();
    };

    const handleTouchMoveWrapper = (e) => {
      if (isDraggingRef.current) {
        e.preventDefault(); // Prevent scrolling while dragging
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
      }
    };

    const handleTouchEndWrapper = () => {
      handleEnd();
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMoveWrapper);
      document.addEventListener('mouseup', handleMouseUpWrapper);
      document.addEventListener('touchmove', handleTouchMoveWrapper, { passive: false });
      document.addEventListener('touchend', handleTouchEndWrapper);

      return () => {
        document.removeEventListener('mousemove', handleMouseMoveWrapper);
        document.removeEventListener('mouseup', handleMouseUpWrapper);
        document.removeEventListener('touchmove', handleTouchMoveWrapper);
        document.removeEventListener('touchend', handleTouchEndWrapper);
      };
    }
  }, [isDragging]);

  const getSwipeClass = () => {
    if (position.x > 50) return 'swipe-right';
    if (position.x < -50) return 'swipe-left';
    return '';
  };

  return (
    <div
      ref={cardRef}
      className={`actor-card ${getSwipeClass()}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) rotate(${rotation}deg) scale(${1 - index * 0.04})`,
        zIndex: 10 - index,
        opacity: index === 0 ? 1 : 0.85 - index * 0.08,
        transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="card-image">
        <img 
          src={images[currentImageIndex]} 
          alt={actor.name}
          onMouseDown={handleImageMouseDown}
          onTouchStart={handleImageTouchStart}
        />
        <div className="card-overlay"></div>
        {images.length > 1 && (
          <div className="image-indicators">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`image-dot ${idx === currentImageIndex ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(idx);
                }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="card-content">
        <div className="actor-name-container">
          <h2 className="actor-name" title={actor.name}>
            {actor.name}
          </h2>
          {lang === 'zh-CN' && actor.chineseNickname && (
            <p className="chinese-nickname">{actor.chineseNickname}</p>
          )}
        </div>
        <p className="actor-age">{actor.age} {t('yearsOld')}</p>
        <p className="actor-bio">{t(actor.bioKey)}</p>
      </div>
      {position.x > 40 && (
        <div className="swipe-indicator like-indicator">{t('like')}</div>
      )}
      {position.x < -40 && (
        <div className="swipe-indicator pass-indicator">{t('pass')}</div>
      )}
    </div>
  );
};

export default ActorCard;

