import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const StretchCard = ({ pose, index, isDragging }) => {
  const cardRef = useRef(null);
  const textRef = useRef(null);
  const bgRef = useRef(null);
  const imageRef = useRef(null);
  
  // GSAP animations
  useEffect(() => {
    if (!cardRef.current || !textRef.current || !bgRef.current) return;
    
    // Simpler initial animation when cards are first rendered
    if (!isDragging) {
      gsap.fromTo(
        cardRef.current,
        { 
          opacity: 0,
          scale: 0.9
        },
        { 
          opacity: 1,
          scale: 1, 
          duration: 0.5, 
          delay: index * 0.1,
          ease: "power2.out",
          force3D: true
        }
      );
      
      // Subtle background animation
      gsap.to(bgRef.current, {
        backgroundPosition: '100% 100%',
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Enhanced hover effect with subtle 3D rotation
      cardRef.current.addEventListener('mouseenter', () => {
        gsap.to(cardRef.current, {
          scale: 1.03,
          boxShadow: '0 20px 30px rgba(0, 0, 0, 0.15)',
          y: -5,
          duration: 0.3,
          ease: 'power2.out',
          force3D: true
        });
        
        // Subtle image zoom
        if (imageRef.current) {
          gsap.to(imageRef.current, {
            scale: 1.1,
            duration: 0.5,
            ease: 'power2.out'
          });
        }
        
        // Text glow effect
        gsap.to(textRef.current.querySelector('h3'), {
          textShadow: '0 0 8px rgba(79, 70, 229, 0.3)',
          duration: 0.3
        });
      });

      cardRef.current.addEventListener('mouseleave', () => {
        gsap.to(cardRef.current, {
          scale: 1,
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
          force3D: true
        });
        
        // Reset image zoom
        if (imageRef.current) {
          gsap.to(imageRef.current, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
        
        // Reset text glow
        gsap.to(textRef.current.querySelector('h3'), {
          textShadow: 'none',
          duration: 0.3
        });
      });
    }

    return () => {
      if (cardRef.current) {
        cardRef.current.removeEventListener('mouseenter', () => {});
        cardRef.current.removeEventListener('mouseleave', () => {});
      }
    };
  }, [isDragging, index]);

  // Format duration to display in minutes:seconds format
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-center">
      <div 
        ref={cardRef}
        className={`card relative w-[300px] h-[430px] p-6 rounded-xl overflow-hidden transition-all duration-200 premium-shine ${
          isDragging ? 'shadow-2xl scale-105 z-50' : 'shadow-lg'
        }`}
        style={{ 
          backfaceVisibility: 'hidden', 
          WebkitFontSmoothing: 'antialiased', 
          MozOsxFontSmoothing: 'grayscale',
          transform: 'translateZ(0)',
          willChange: 'transform',
          isolation: 'isolate' // Creates stacking context for better z-index
        }}
      >
        {/* Enhanced premium border glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 via-secondary/40 to-primary/50 rounded-xl opacity-30 blur-sm animate-pulse"></div>
        
        {/* Premium inner border */}
        <div className="absolute inset-0 rounded-xl border border-white/30 dark:border-gray-700/30 backdrop-blur-sm"></div>
        
        {/* Animated background */}
        <div 
          ref={bgRef}
          className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-white/20 to-purple-50/30 dark:from-indigo-900/20 dark:via-gray-800/20 dark:to-purple-900/20"
          style={{
            backgroundSize: '200% 200%',
            backgroundPosition: '0% 0%'
          }}
        />
        
        {/* Premium corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-[250%] h-[250%] bg-gradient-to-tl from-primary/20 via-transparent to-transparent origin-top-right -rotate-45 transform translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-3 right-3">
          <div className="w-2 h-2 rounded-full bg-indigo-400 opacity-70 animate-pulse"></div>
        </div>
        <div className="absolute bottom-3 left-3">
          <div className="w-2 h-2 rounded-full bg-purple-400 opacity-70 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        {/* Content container */}
        <div className="relative flex flex-col items-center z-10" ref={textRef}>
          <div className="w-24 h-24 mt-3 mb-5 bg-gradient-to-br from-primary/80 to-secondary/80 rounded-full flex items-center justify-center shadow-lg border-2 border-white/50 dark:border-gray-700/50 transform-gpu">
            <div className="text-3xl font-bold text-white">
              {pose.name.charAt(0)}
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-wide"
                style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {pose.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed px-3 line-clamp-3"
               style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: '0.02em' }}>
              {pose.description}
            </p>
            
            {/* Timer display with enhanced premium styling */}
            <div className="flex items-center justify-center mt-6 mb-2">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/10 dark:bg-primary/20 blur-md rounded-full animate-pulse-scale"></div>
                <div className="relative px-6 py-2 rounded-full bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 flex items-center shadow-sm">
                  <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-md font-medium text-primary dark:text-primary/90">
                    {formatDuration(pose.duration)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Premium badge for visual enhancement */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-full">
              <div className="w-4/5 mx-auto h-0.5 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
            </div>
          </div>
          
          {/* Enhanced drag handle indicator */}
          <div className="absolute bottom-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <div className="group bg-gray-100/80 dark:bg-gray-700/50 p-1.5 rounded-md backdrop-blur-sm hover:bg-white dark:hover:bg-gray-600/50 transition-all duration-300 shadow-sm hover:shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
          </div>
          
          {/* Enhanced sequence number */}
          <div className="absolute top-3 left-3 bg-white/80 dark:bg-gray-800/80 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold backdrop-blur-sm shadow-sm border border-white/50 dark:border-gray-700/50">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {index + 1}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StretchCard; 