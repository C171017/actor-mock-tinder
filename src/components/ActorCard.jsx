import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import './ActorCard.css';

const ActorCard = ({ actor, onSwipe, index }) => {
  const { t } = useTranslation();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const cardRef = useRef(null);

  useEffect(() => {
    setPosition({ x: 0, y: 0 });
    setRotation(0);
    setIsDragging(false);
    isDraggingRef.current = false;
  }, [actor.id]);

  const handleStart = (clientX, clientY) => {
    startPosRef.current = { x: clientX, y: clientY };
    isDraggingRef.current = true;
    setIsDragging(true);
  };

  const handleMove = (clientX, clientY) => {
    if (!isDraggingRef.current) return;

    const deltaX = clientX - startPosRef.current.x;
    const deltaY = clientY - startPosRef.current.y;

    setPosition({ x: deltaX, y: deltaY });
    setRotation(deltaX * 0.1);
  };

  const handleEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    const threshold = 80;
    if (Math.abs(position.x) > threshold) {
      const direction = position.x > 0 ? 'right' : 'left';
      // Animate card off screen
      const exitX = position.x > 0 ? window.innerWidth : -window.innerWidth;
      setPosition({ x: exitX, y: position.y });
      setRotation(position.x > 0 ? 30 : -30);
      setTimeout(() => {
        onSwipe(direction);
      }, 200);
    } else {
      // Snap back with spring animation
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
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
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    if (isDraggingRef.current) {
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
      document.addEventListener('touchmove', handleTouchMoveWrapper);
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
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${1 - index * 0.04})`,
        zIndex: 10 - index,
        opacity: index === 0 ? 1 : 0.85 - index * 0.08,
        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="card-image">
        <img src={actor.image} alt={actor.name} />
        <div className="card-overlay"></div>
      </div>
      <div className="card-content">
        <h2 className="actor-name" title={actor.name}>{actor.name}</h2>
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

