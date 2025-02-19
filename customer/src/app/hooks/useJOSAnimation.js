import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import JOS from 'jos-animation';

// Custom hook for initializing JOS animations
const useJOSAnimation = () => {
  const location = useLocation();
  useEffect(() => {
    JOS.init({
      passive: false,
      once: true,
      animation: 'fade-up',
      timingFunction: 'ease',
      threshold: 0,
      delay: 0.5,
      duration: 0.7,
      scrollDirection: 'down',
      rootMargin: '0% 0% 15% 0%',
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    JOS.refresh();
  }, [location.pathname]);
};

export default useJOSAnimation;
