import React, { useEffect, useRef } from 'react';

const ParticlesBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.width = `${Math.random() * 6 + 2}px`;
      particle.style.height = particle.style.width;
      particle.style.animationDuration = `${Math.random() * 20 + 15}s`;
      particle.style.animationDelay = `${Math.random() * 10}s`;
      particle.style.opacity = Math.random() * 0.3 + 0.1;
      container.appendChild(particle);
      particles.push(particle);
    }

    return () => {
      particles.forEach(p => {
        if (p.parentNode) p.remove();
      });
    };
  }, []);

  return <div ref={containerRef} className="particles" />;
};

export default ParticlesBackground;