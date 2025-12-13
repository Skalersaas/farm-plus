import { useEffect, useRef, useState } from 'react';

export function useScrollBlur(maxBlur: number = 20) {
  const ref = useRef<HTMLDivElement>(null);
  const [blur, setBlur] = useState(0);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const scrollContainer = element.closest('.scroll-container');
    if (!scrollContainer) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how much of the element is visible
      // When element top is at bottom of screen: progress = 0
      // When element is fully in view (centered): progress = 1
      const elementCenter = rect.top + rect.height / 2;
      const screenCenter = windowHeight / 2;

      // Distance from center (0 = centered, 1 = at edge)
      const distanceFromCenter = Math.abs(elementCenter - screenCenter) / (windowHeight / 2);

      // Progress: 1 when centered, 0 when at edge
      const progress = Math.max(0, Math.min(1, 1 - distanceFromCenter));

      setBlur(progress * maxBlur);
      setOpacity(progress * 0.15); // Max opacity for glass effect
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [maxBlur]);

  return { ref, blur, opacity };
}
