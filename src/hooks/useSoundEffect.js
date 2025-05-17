import { useRef, useEffect, useState } from 'react';

const useSoundEffect = (soundUrl) => {
  const audioRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    try {
      // Create audio element
      audioRef.current = new Audio(soundUrl);
      
      // Add event listeners
      const handleLoaded = () => {
        setIsLoaded(true);
        setHasError(false);
      };
      
      const handleError = () => {
        console.log(`Sound could not be loaded: ${soundUrl}`);
        setHasError(true);
        setIsLoaded(false);
      };
      
      audioRef.current.addEventListener('loadeddata', handleLoaded);
      audioRef.current.addEventListener('error', handleError);
      
      // Clean up
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('loadeddata', handleLoaded);
          audioRef.current.removeEventListener('error', handleError);
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    } catch (err) {
      console.error("Error setting up audio:", err);
      setHasError(true);
    }
  }, [soundUrl]);
  
  const play = () => {
    if (!audioRef.current || hasError) return;
    
    try {
      // Reset the audio to start
      audioRef.current.currentTime = 0;
      
      // Promise-based play with fallback
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Handle autoplay restrictions
          console.log("Audio play error:", error);
        });
      }
    } catch (err) {
      console.error("Error playing sound:", err);
    }
  };
  
  const stop = () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } catch (err) {
      console.error("Error stopping sound:", err);
    }
  };
  
  return { play, stop, isLoaded, hasError };
};

export default useSoundEffect; 