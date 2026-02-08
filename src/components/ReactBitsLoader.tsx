// ReactBitsLoader component will be added here 
import React, { useEffect } from 'react';
import BlurText from './BlurText';

interface ReactBitsLoaderProps {
  onComplete: () => void;
}

const ReactBitsLoader: React.FC<ReactBitsLoaderProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center">
      <img
        src="/translogo.png"
        alt="Stacklet Logo"
        className="h-32 w-32 md:h-40 md:w-40 mb-4"
        style={{ filter: 'brightness(0) invert(1)' }}
      />
      <BlurText
        text="Welcome to Stacklet."
        delay={300}
        animateBy="words"
        direction="top"
        className="text-5xl md:text-6xl font-black text-white tracking-wider font-['Orbitron',monospace] text-center"
      />
    </div>
  );
};

export default ReactBitsLoader;