import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import useRoutineStore from '../store/routineStore';

const TimerCircle = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  // Use a ref instead of state for elapsed time to prevent unnecessary rerenders
  const totalElapsedRef = useRef(0);
  // Store the time when pause happened
  const pauseTimeRef = useRef(null);
  // Track if we're actively counting
  const isActiveRef = useRef(false);
  // Store the animation frame ID
  const animationRef = useRef(null);
  // Reference for SVG elements
  const circleRef = useRef(null);
  const textRef = useRef(null);
  // Reference for flow effect
  const flowEffectRef = useRef(null);
  
  const routineSpeed = useRoutineStore(state => state.routineSpeed);
  const isPlaying = useRoutineStore(state => state.isPlaying);
  const isDarkMode = useRoutineStore(state => state.isDarkMode);
  
  // Get speed multiplier
  const getSpeedMultiplier = () => {
    switch(routineSpeed) {
      case 'slow': return 1.5;
      case 'fast': return 0.7;
      default: return 1;
    }
  };
  
  // Reset when duration changes (new pose)
  useEffect(() => {
    setTimeLeft(duration);
    totalElapsedRef.current = 0;
    pauseTimeRef.current = null;
    isActiveRef.current = false;
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // Improved loading animation when new pose starts
    if (circleRef.current && textRef.current) {
      // Stop any ongoing animations first
      gsap.killTweensOf(circleRef.current);
      gsap.killTweensOf(textRef.current);
      
      // Reset circle to starting position first
      gsap.set(circleRef.current, {
        strokeDashoffset: 282.7,
        strokeWidth: 6,
        opacity: 0.7
      });
      
      // Animate circle radius with better easing
      gsap.to(circleRef.current, {
        strokeDashoffset: 0,
        strokeWidth: 8,
        opacity: 1,
        duration: 0.7,
        ease: 'power2.inOut',
        onComplete: () => {
          // Set back to the actual progress
          const progress = duration > 0 ? (timeLeft / duration) * 100 : 0;
          gsap.set(circleRef.current, {
            strokeDashoffset: 282.7 * (1 - progress / 100)
          });
        }
      });
      
      // Improved text animation
      gsap.fromTo(
        textRef.current,
        { 
          scale: 0.8, 
          opacity: 0.5,
          filter: 'blur(2px)'
        },
        { 
          scale: 1, 
          opacity: 1, 
          filter: 'blur(0px)',
          duration: 0.6, 
          ease: 'back.out(1.7)' 
        }
      );
      
      // Add initial pulse effect
      gsap.to(circleRef.current, {
        scale: 1.05,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut',
        delay: 0.7
      });
    }
  }, [duration]);
  
  // Handle play/pause status changes
  useEffect(() => {
    if (isPlaying) {
      // Starting timer
      startTimer();
      
      // Add resume animation effect
      if (circleRef.current && timeLeft < duration) {
        // Clear any existing animations first
        gsap.killTweensOf(circleRef.current);
        
        gsap.fromTo(
          circleRef.current,
          { scale: 0.98 },
          { 
            scale: 1, 
            duration: 0.4, 
            ease: 'elastic.out(1, 0.5)'
          }
        );
      }
    } else {
      // Pausing timer
      pauseTimer();
      
      // Add pause animation effect
      if (circleRef.current) {
        // Clear any existing animations first
        gsap.killTweensOf(circleRef.current);
        
        gsap.fromTo(
          circleRef.current,
          { scale: 1 },
          { 
            scale: 0.98, 
            duration: 0.3, 
            ease: 'power3.out'
          }
        );
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Kill any remaining GSAP animations
      if (circleRef.current) {
        gsap.killTweensOf(circleRef.current);
      }
      if (textRef.current) {
        gsap.killTweensOf(textRef.current);
      }
    };
  }, [isPlaying]);
  
  // Start the timer
  const startTimer = () => {
    // Already active, don't start again
    if (isActiveRef.current) return;
    
    const startTime = performance.now();
    isActiveRef.current = true;
    
    const speedMultiplier = getSpeedMultiplier();
    
    const animate = () => {
      if (!isActiveRef.current) return;
      
      const now = performance.now();
      const elapsedSinceStart = (now - startTime) / 1000 / speedMultiplier;
      
      // Calculate new time left based on total elapsed time
      const newElapsed = totalElapsedRef.current + elapsedSinceStart;
      const newTimeLeft = Math.max(0, duration - newElapsed);
      
      // Update the time left if it has changed significantly (0.1s)
      if (Math.abs(timeLeft - newTimeLeft) > 0.1) {
        setTimeLeft(newTimeLeft);
      }
      
      // Check if timer completed
      if (newTimeLeft <= 0) {
        cancelAnimationFrame(animationRef.current);
        totalElapsedRef.current = duration;
        setTimeLeft(0);
        isActiveRef.current = false;
        
        // Add completion animation
        if (circleRef.current) {
          gsap.to(circleRef.current, {
            strokeDashoffset: 0,
            stroke: '#10B981', // Success green
            strokeWidth: 10,
            duration: 0.4,
            ease: 'power2.out'
          });
        }
        
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 400); // Slight delay for completion animation
        return;
      }
      
      // Continue animation loop
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start the animation
    animationRef.current = requestAnimationFrame(animate);
  };
  
  // Pause the timer
  const pauseTimer = () => {
    if (!isActiveRef.current) return;
    
    // Stop the animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // Update the total elapsed time
    totalElapsedRef.current = duration - timeLeft;
    isActiveRef.current = false;
  };
  
  // Update times when speed changes
  useEffect(() => {
    if (isPlaying) {
      // Restart with new speed
      pauseTimer();
      startTimer();
      
      // Add subtle pulse animation on speed change
      if (circleRef.current) {
        gsap.fromTo(
          circleRef.current,
          { scale: 1.05, strokeWidth: 9 },
          { 
            scale: 1, 
            strokeWidth: 8,
            duration: 0.4, 
            ease: 'elastic.out(1, 0.5)'
          }
        );
      }
    }
  }, [routineSpeed]);
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate colors based on remaining time
  const getColor = () => {
    if (duration <= 0) return '#6B7280'; // Gray
    
    const percentRemaining = timeLeft / duration;
    if (percentRemaining > 0.66) {
      return '#4F46E5'; // Blue
    } else if (percentRemaining > 0.33) {
      return '#EAB308'; // Yellow
    } else {
      return '#EF4444'; // Red
    }
  };
  
  // Calculate progress (smooth value between 0-100)
  const progress = duration > 0 ? (timeLeft / duration) * 100 : 0;
  const color = getColor();
  
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative w-64 h-64 timer-container transform-gpu">
        {/* Flowing decreasing timer effect - replaces the ripple effect */}
        {isPlaying && (
          <div 
            className="absolute inset-0 rounded-full overflow-hidden timer-flow-container" 
            style={{ transform: 'rotate(-90deg)' }}
            ref={flowEffectRef}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="timer-flow"
                style={{ 
                  height: `${100 - progress}%`, 
                  bottom: 0,
                  background: `linear-gradient(to top, ${color}40, transparent)`,
                  animation: isPlaying ? 'flow-down 3s ease-out infinite' : 'none'
                }}
              />
            </div>
          </div>
        )}
          
        {/* SVG Circle Timer */}
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={isDarkMode ? '#374151' : '#E5E7EB'}
            strokeOpacity="0.3"
            strokeWidth="8"
          />
          
          {/* Glow effect - modified for flowing appearance */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={`${color}CC`} />
            </linearGradient>
            
            {/* Flowing water effect */}
            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={`${color}00`} />
              <stop offset="50%" stopColor={color} />
              <stop offset="100%" stopColor={`${color}80`} />
            </linearGradient>
          </defs>
          
          {/* Progress circle */}
          <circle
            ref={circleRef}
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={`url(#progressGradient)`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="282.7"
            strokeDashoffset={282.7 * (1 - progress / 100)}
            transform="rotate(-90 50 50)"
          />
          
          {/* Inner circle for depth */}
          <circle 
            cx="50" 
            cy="50" 
            r="38" 
            fill="none" 
            stroke={color} 
            strokeWidth="1" 
            strokeOpacity="0.2" 
          />
        </svg>
        
        {/* Time display */}
        <div 
          ref={textRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold"
          style={{ color }}
        >
          {formatTime(timeLeft)}
        </div>
        
        {/* Percent indicator - Fixed positioning with more space */}
        <div 
          className="absolute w-full text-center font-semibold text-sm"
          style={{ 
            bottom: '-25px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: color,
            padding: '8px 0',
            transition: 'color 0.5s ease'
          }}
        >
          <span className="inline-block">
            {Math.round(progress)}% remaining
          </span>
        </div>
      </div>
    </div>
  );
};

export default TimerCircle; 