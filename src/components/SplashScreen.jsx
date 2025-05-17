import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

const SplashScreen = ({ onComplete }) => {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);
  const heartRef = useRef(null);
  const progressRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Create loading effect and coordinate with initial loader
  useEffect(() => {
    // First handle the transition element
    const appTransition = document.querySelector('.app-transition');
    
    // Handle coordination with the initial loader
    const initialLoader = document.getElementById('initial-loader');
    
    if (initialLoader) {
      // Keep it visible for now, we'll handle the transition
      initialLoader.style.opacity = '1';
      initialLoader.style.display = 'flex';
      
      // Only start our transition once React has signaled it's ready
      if (window.APP_READY_FOR_TRANSITION) {
        // Short delay to ensure our content is ready
        setTimeout(() => {
          // Fade out initial loader
          initialLoader.style.opacity = '0';
          setTimeout(() => {
            initialLoader.style.display = 'none';
            // Now that initial loader is gone, we can signal our content is loaded
            setIsLoaded(true);
          }, 400);
        }, 500);
      } else {
        // Set a backup timer if the window variable isn't set
        setTimeout(() => {
          initialLoader.style.opacity = '0';
          setTimeout(() => {
            initialLoader.style.display = 'none';
            setIsLoaded(true);
          }, 400);
        }, 800);
      }
    } else {
      // If initial loader doesn't exist, just load normally
      setIsLoaded(true);
    }
    
    // Set a backup for transition element removal
    const transitionTimer = setTimeout(() => {
      if (appTransition) {
        appTransition.style.opacity = '0';
        setTimeout(() => {
          appTransition.remove();
        }, 300);
      }
    }, 2500);
    
    return () => {
      clearTimeout(transitionTimer);
      // Make sure transition is removed when component unmounts
      if (appTransition) {
        appTransition.remove();
      }
    };
  }, []);
  
  useEffect(() => {
    if (!isLoaded) return;
    
    // Remove app transition element when content is fully loaded
    const appTransition = document.querySelector('.app-transition');
    if (appTransition) {
      setTimeout(() => {
        appTransition.style.opacity = '0';
        setTimeout(() => {
          appTransition.remove();
        }, 300);
      }, 500);
    }
    
    // Animate progress bar
    gsap.to(progressRef.current, {
      width: '100%',
      duration: 1.5,
      ease: "power1.inOut"
    });
    
    // Create the animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // When all animations complete, call the onComplete callback
        if (onComplete) {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.5,
            onComplete
          });
        }
      }
    });
    
    // Animate logo
    tl.fromTo(
      logoRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.7)" }
    );
    
    // Animate text
    tl.fromTo(
      textRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
      "-=0.2" // Slight overlap with previous animation
    );
    
    // Animate heart
    tl.fromTo(
      heartRef.current,
      { scale: 0 },
      { 
        scale: 1, 
        duration: 0.5, 
        ease: "elastic.out(1, 0.5)" 
      },
      "-=0.1"
    );
    
    // Pulse animation for heart
    tl.to(
      heartRef.current,
      { 
        scale: 1.2, 
        duration: 0.3,
        repeat: 3,
        yoyo: true,
        ease: "power1.inOut"
      }
    );
    
    // Add background elements animations
    const stars = document.querySelectorAll('.splash-star');
    const lungs = document.querySelectorAll('.splash-lung');
    const hearts = document.querySelectorAll('.splash-heart');
    
    stars.forEach((star, index) => {
      gsap.fromTo(
        star,
        { scale: 0, opacity: 0, rotation: 0 },
        { 
          scale: 1, 
          opacity: 0.7, 
          rotation: 360,
          duration: 0.8, 
          delay: 0.1 * index,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut"
        }
      );
    });
    
    lungs.forEach((lung, index) => {
      gsap.fromTo(
        lung,
        { scale: 0.8, opacity: 0.5 },
        { 
          scale: 1.1, 
          opacity: 0.8,
          duration: 1.5, 
          delay: 0.5 * index,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        }
      );
    });
    
    hearts.forEach((heart, index) => {
      gsap.fromTo(
        heart,
        { scale: 0.9, opacity: 0.5, y: 0 },
        { 
          scale: 1.1, 
          opacity: 0.8,
          y: -10,
          duration: 1.2, 
          delay: 0.3 * index,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        }
      );
    });
    
    // Delay before exit
    tl.to({}, { duration: 1 });
    
    return () => {
      tl.kill();
    };
  }, [onComplete, isLoaded]);

  // Function to generate random position
  const randomPosition = () => {
    return {
      top: `${Math.floor(Math.random() * 80) + 10}%`,
      left: `${Math.floor(Math.random() * 80) + 10}%`,
      opacity: (Math.random() * 0.5) + 0.1
    };
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex-center flex-col bg-gradient-to-b from-indigo-600 to-purple-700 text-white overflow-hidden"
      style={{
        opacity: 1,
        visibility: 'visible',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale'
      }}
    >
      {/* Background design elements */}
      {/* Stars */}
      {[...Array(10)].map((_, i) => {
        const pos = randomPosition();
        return (
          <div 
            key={`star-${i}`} 
            className="absolute splash-star"
            style={{
              top: pos.top,
              left: pos.left,
              opacity: pos.opacity
            }}
          >
            <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
            </svg>
          </div>
        );
      })}
      
      {/* Lungs */}
      {[...Array(2)].map((_, i) => {
        const pos = randomPosition();
        return (
          <div 
            key={`lung-${i}`} 
            className="absolute splash-lung w-20 h-20 opacity-20"
            style={{
              top: pos.top,
              left: pos.left,
            }}
          >
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5,4 L17,4 C20.5,4 21,7 21,12 C21,16 20.5,19 18,19 C16.5,19 15,17.5 15,15.5 C15,13.5 16,12 16,12 L16,2 L12,2 L12,12 C12,12 10.5,13.5 10.5,15.5 C10.5,17.5 9,19 7.5,19 C5,19 4.5,16 4.5,12 C4.5,7 5,4 8.5,4 L10,4"></path>
            </svg>
          </div>
        );
      })}
      
      {/* Hearts */}
      {[...Array(5)].map((_, i) => {
        const pos = randomPosition();
        return (
          <div 
            key={`heart-${i}`} 
            className="absolute splash-heart"
            style={{
              top: pos.top,
              left: pos.left,
              opacity: pos.opacity
            }}
          >
            <svg className="w-6 h-6 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"></path>
            </svg>
          </div>
        );
      })}
      
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-indigo-600/30 animate-gradient-x"></div>
      
      {/* Content */}
      <div ref={logoRef} className="mb-6 text-6xl font-bold">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200">
          StretchFlow
        </span>
      </div>
      
      <div ref={textRef} className="flex items-center text-xl">
        <span>Crafted by Areeb </span>
        <span ref={heartRef} className="text-pink-400 px-1">❤️</span>
        <span> with love for CodeCircuit</span>
      </div>
      
      {/* Loading progress bar */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-white/20 rounded-full overflow-hidden">
        <div
          ref={progressRef} 
          className="h-full bg-gradient-to-r from-indigo-400 to-purple-400"
          style={{ width: '0%' }}
        ></div>
      </div>
      
      {/* Loading text */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-sm text-white/70">
        Loading your wellness experience...
      </div>
    </div>
  );
};

export default SplashScreen; 