import React, { useEffect, useRef } from 'react';

const EnhancedParticles = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles = [];
    const colors = [
      '#a78bfa', // Light Purple
      '#7c3aed', // Purple
      '#ec4899', // Pink
      '#f472b6', // Light Pink
      '#8b5cf6', // Violet
      '#c084fc', // Lavender
      '#fbcfe8', // Pale Pink
      '#ddd6fe', // Pale Purple
    ];
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 8 + 3;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      particle.className = 'particle galaxy-particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = color;
      particle.style.boxShadow = `0 0 ${size * 3}px ${color}80, 0 0 ${size * 6}px ${color}40`;
      particle.style.animationDuration = `${Math.random() * 30 + 20}s`;
      particle.style.animationDelay = `${Math.random() * 20}s`;
      particle.style.opacity = Math.random() * 0.8 + 0.2;
      particle.style.borderRadius = Math.random() > 0.3 ? '50%' : '2px';
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

export default EnhancedParticles;