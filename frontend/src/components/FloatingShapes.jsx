import React, { useEffect, useRef } from 'react';

const FloatingShapes = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const shapes = [];
    const colors = [
      'rgba(167, 139, 250, 0.15)',
      'rgba(124, 58, 237, 0.12)',
      'rgba(236, 72, 153, 0.12)',
      'rgba(139, 92, 246, 0.15)',
      'rgba(196, 181, 253, 0.10)',
      'rgba(251, 207, 232, 0.10)',
    ];
    const shapeTypes = ['circle', 'square', 'diamond', 'star', 'hexagon'];

    for (let i = 0; i < 15; i++) {
      const shape = document.createElement('div');
      const size = Math.random() * 60 + 30;
      const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      shape.className = 'floating-shape crystal-shape';
      shape.style.width = `${size}px`;
      shape.style.height = `${size}px`;
      shape.style.left = `${Math.random() * 90 + 5}%`;
      shape.style.top = `${Math.random() * 90 + 5}%`;
      shape.style.background = color;
      shape.style.border = `1px solid ${color.replace('0.15', '0.2').replace('0.12', '0.2').replace('0.10', '0.2')}`;
      shape.style.boxShadow = `0 0 40px ${color}`;
      shape.style.animationDuration = `${Math.random() * 25 + 20}s`;
      shape.style.animationDelay = `${Math.random() * 15}s`;
      shape.style.backdropFilter = 'blur(4px)';
      
      if (type === 'circle') {
        shape.style.borderRadius = '50%';
      } else if (type === 'square') {
        shape.style.borderRadius = '8px';
        shape.style.transform = `rotate(${Math.random() * 45}deg)`;
      } else if (type === 'diamond') {
        shape.style.transform = 'rotate(45deg)';
        shape.style.borderRadius = '4px';
        shape.style.width = `${size * 0.7}px`;
        shape.style.height = `${size * 0.7}px`;
      } else if (type === 'star') {
        shape.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
        shape.style.background = color;
        shape.style.width = `${size * 1.8}px`;
        shape.style.height = `${size * 1.8}px`;
        shape.style.border = 'none';
      } else if (type === 'hexagon') {
        shape.style.clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
        shape.style.background = color;
        shape.style.width = `${size * 1.5}px`;
        shape.style.height = `${size * 1.5}px`;
        shape.style.border = 'none';
      }
      
      container.appendChild(shape);
      shapes.push(shape);
    }

    return () => {
      shapes.forEach(s => {
        if (s.parentNode) s.remove();
      });
    };
  }, []);

  return <div ref={containerRef} className="floating-shapes" />;
};

export default FloatingShapes;