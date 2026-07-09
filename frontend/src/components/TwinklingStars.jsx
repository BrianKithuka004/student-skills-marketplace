import React, { useEffect, useRef } from 'react';

const TwinklingStars = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const stars = [];
    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      const size = Math.random() * 3 + 1;
      
      star.className = 'star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.background = '#ffffff';
      star.style.borderRadius = '50%';
      star.style.boxShadow = `0 0 ${size * 4}px rgba(255,255,255,0.3)`;
      star.style.animationDuration = `${Math.random() * 4 + 2}s`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      star.style.opacity = Math.random() * 0.5 + 0.1;
      
      container.appendChild(star);
      stars.push(star);
    }

    return () => {
      stars.forEach(s => {
        if (s.parentNode) s.remove();
      });
    };
  }, []);

  return <div ref={containerRef} className="twinkling-stars" />;
};

export default TwinklingStars;