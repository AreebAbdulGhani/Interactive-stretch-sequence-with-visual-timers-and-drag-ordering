import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import DragList from './components/DragList';
import RoutinePlayer from './components/RoutinePlayer';
import SettingsPanel from './components/SettingsPanel';
import SplashScreen from './components/SplashScreen';
import useRoutineStore from './store/routineStore';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [routineSessionId, setRoutineSessionId] = useState(null);
  
  const { startRoutine, isDarkMode, toggleDarkMode } = useRoutineStore();
  const animatedElementsRef = useRef([]);

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setShowSplash(false);
  };
  
  // Start the routine
  const handleStartRoutine = () => {
    console.log("Starting routine from App component");
    setIsTransitioning(true);
    
    try {
      // Create a sequence animation before starting - with fewer elements for better performance
      gsap.to('.card', {
        y: -10, // Reduced movement for better performance
        opacity: 0,
        stagger: 0.02, // Faster stagger
        duration: 0.2, // Faster animation
        ease: 'power2.in',
        onComplete: () => {
          startRoutine();
          
          // Small timeout to ensure store is updated before showing player
          setTimeout(() => {
            setRoutineSessionId(Date.now());
            setShowPlayer(true);
            setIsTransitioning(false);
          }, 50); // Reduced timeout
        }
      });
      
      // Fallback in case animation fails
      setTimeout(() => {
        if (isTransitioning) {
          console.log("Animation transition fallback triggered");
          startRoutine();
          setRoutineSessionId(Date.now());
          setShowPlayer(true);
          setIsTransitioning(false);
        }
      }, 500); // Reduced timeout
    } catch (err) {
      console.error("Error during start transition:", err);
      // Direct fallback if animation throws error
      startRoutine();
      setRoutineSessionId(Date.now());
      setShowPlayer(true);
      setIsTransitioning(false);
    }
  };
  
  // Handle routine close
  const handleCloseRoutine = () => {
    console.log("Closing routine player");
    setShowPlayer(false);
    setRoutineSessionId(null);
    
    try {
      // Simplified animation for better performance
      gsap.fromTo('.card', 
        { y: -10, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.02, 
          duration: 0.3, 
          ease: 'power2.out',
        }
      );
    } catch (err) {
      console.error("Error during close transition:", err);
    }
  };
  
  // Toggle settings panel
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
  // Apply page animations - with improved performance
  useEffect(() => {
    if (!showSplash) {
      try {
        // Simplified animations for better performance
        gsap.fromTo(
          '.app-header',
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
        
        gsap.fromTo(
          '.main-content',
          { opacity: 0 },
          { opacity: 1, duration: 0.3 }
        );
        
        gsap.fromTo(
          '.card',
          { y: 20, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.3, 
            stagger: 0.03, 
            delay: 0.1, 
            ease: 'power2.out',
          }
        );
        
        gsap.fromTo(
          '.app-buttons button',
          { y: 10, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.3, 
            delay: 0.3, 
            ease: 'power2.out',
          }
        );

        // Fewer decorative animations
        gsap.fromTo(
          '.decorative-circle:nth-child(-n+3)', // Limit to first 3 elements
          { scale: 0, opacity: 0 },
          { 
            scale: 1, 
            opacity: 0.7, 
            duration: 0.5, 
            delay: 0.2, 
            stagger: 0.1
          }
        );
      } catch (err) {
        console.error("Error in page animations:", err);
      }
    }
  }, [showSplash]);

  // Setup intersection observer to only animate elements in viewport
  useEffect(() => {
    if (showSplash) return;

    // Create a new IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-viewport');
          } else {
            entry.target.classList.remove('in-viewport');
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    // Collect and observe all animated elements
    const animatedElements = document.querySelectorAll('.animate-float, .animate-pulse, .animate-spin-slow, .animate-pulse-scale');
    animatedElements.forEach(el => {
      observer.observe(el);
      animatedElementsRef.current.push(el);
    });

    return () => {
      // Cleanup observer
      animatedElementsRef.current.forEach(el => {
        if (el) observer.unobserve(el);
      });
      observer.disconnect();
    };
  }, [showSplash]);

  // Simplified background color animation - using CSS variables instead of JS
  useEffect(() => {
    // Only make changes to root variables, not direct DOM manipulation
    const root = document.documentElement;
    root.style.setProperty('--footer-gradient-from', '#4F46E5');
    root.style.setProperty('--footer-gradient-to', '#8B5CF6');
    
    // No interval needed, CSS animations will handle this
    
    return () => {
      // Clean up
    };
  }, []);
  
  // If splash screen is showing, only render that
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Decorative circles - Reduced number for better performance
  const DecorativeCircles = () => (
    <>
      <div className="decorative-circle absolute w-96 h-96 rounded-full bg-indigo-500/10 blur-2xl -left-20 top-40 animate-pulse"></div>
      <div className="decorative-circle absolute w-[40rem] h-[40rem] rounded-full bg-purple-500/10 blur-3xl -right-32 top-80 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="decorative-circle absolute w-[36rem] h-[36rem] rounded-full bg-blue-500/10 blur-3xl -left-32 bottom-40 animate-pulse" style={{animationDelay: '2s'}}></div>
      {/* Removed extra circles for better performance */}
    </>
  );

  // Animated shapes - Reduced number by 50% for better performance
  const AnimatedShapes = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-[20%] right-[10%] w-24 h-24 border-4 border-indigo-500/20 rounded-lg animate-float" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-[30%] left-[5%] w-16 h-16 border-4 border-purple-500/20 rounded-full animate-float" style={{animationDelay: '0s'}}></div>
      
      {/* Only render extra decorations on desktop */}
      <div className="hidden lg:block absolute top-[60%] left-[25%] w-32 h-32 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse-scale"></div>
      <div className="hidden lg:block absolute bottom-[15%] left-[10%] w-64 h-32 bg-white/5 dark:bg-gray-900/5 rounded-2xl backdrop-blur-sm border border-white/10 dark:border-gray-700/10 transform rotate-12 animate-float" style={{animationDelay: '3s', animationDuration: '15s'}}></div>
      
      {/* Reduce the number of stars, hearts and lungs by 70% */}
      {[...Array(3)].map((_, i) => (
        <div 
          key={`star-${i}`}
          className="absolute" 
          style={{
            top: `${10 + Math.random() * 80}%`, 
            left: `${10 + Math.random() * 80}%`,
            opacity: 0.3 + Math.random() * 0.4,
            transform: `scale(${0.6 + Math.random() * 0.8})`,
            animationDelay: `${Math.random() * 3}s`
          }}
        >
          <svg className="w-6 h-6 text-indigo-400 dark:text-indigo-300 animate-pulse-scale" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
          </svg>
        </div>
      ))}
      
      {/* Only 2 hearts */}
      {[...Array(2)].map((_, i) => (
        <div 
          key={`heart-${i}`}
          className="absolute" 
          style={{
            top: `${15 + Math.random() * 70}%`, 
            left: `${15 + Math.random() * 70}%`,
            opacity: 0.2 + Math.random() * 0.3,
            transform: `scale(${0.7 + Math.random() * 0.5}) rotate(${-20 + Math.random() * 40}deg)`,
            animationDelay: `${Math.random() * 5}s`
          }}
        >
          <svg className="w-6 h-6 text-pink-400 dark:text-pink-300 animate-float" fill="currentColor" viewBox="0 0 24 24" style={{animationDuration: `${8 + Math.random() * 4}s`}}>
            <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"></path>
          </svg>
        </div>
      ))}
      
      {/* Only 1 lung */}
      <div 
        key="lung-1"
        className="absolute hidden lg:block" 
        style={{
          top: `${30 + Math.random() * 40}%`, 
          left: `${20 + Math.random() * 60}%`,
          opacity: 0.1 + Math.random() * 0.2,
          transform: `scale(${1 + Math.random() * 1}) rotate(${-10 + Math.random() * 20}deg)`,
          animationDelay: `${Math.random() * 2}s`
        }}
      >
        <svg className="w-12 h-12 text-gray-400 dark:text-gray-300 animate-breathing" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.5,4 L17,4 C20.5,4 21,7 21,12 C21,16 20.5,19 18,19 C16.5,19 15,17.5 15,15.5 C15,13.5 16,12 16,12 L16,2 L12,2 L12,12 C12,12 10.5,13.5 10.5,15.5 C10.5,17.5 9,19 7.5,19 C5,19 4.5,16 4.5,12 C4.5,7 5,4 8.5,4 L10,4" strokeWidth="1" stroke="currentColor" fill="none"></path>
        </svg>
      </div>
    </div>
  );

  // Premium grid pattern
  const GridPattern = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 dark:opacity-5">
      <div className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(to right, ${isDarkMode ? '#ffffff10' : '#00000010'} 1px, transparent 1px),
            linear-gradient(to bottom, ${isDarkMode ? '#ffffff10' : '#00000010'} 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Add diagonal lines for even more premium feel */}
      <div className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(45deg, ${isDarkMode ? '#ffffff05' : '#00000005'} 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      />
    </div>
  );

  return (
    <div className="app-container min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200 relative overflow-x-hidden overflow-y-auto">
      {/* Background elements */}
      <DecorativeCircles />
      <AnimatedShapes />
      <GridPattern />
      
      {/* Main content */}
      <div className="relative z-10">
        {/* App header */}
        <header className="app-header py-6 px-6 md:px-10 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <div className="text-3xl md:text-4xl font-extrabold gradient-text mb-4 md:mb-0">
              StretchFlow
            </div>
            <div className="ml-3 px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-xs rounded-full font-semibold">Premium</div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-sm font-medium text-gray-600 dark:text-gray-300">Customize your wellness routine</span>
            
            {/* Toggle dark mode */}
            <button
              onClick={toggleDarkMode}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors relative p-2"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            <button 
              onClick={toggleSettings}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors relative group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>
        </header>
        
        <main className="container max-w-[1400px] mx-auto px-4 md:px-6 pb-24 main-content pt-24">
          {/* Hero section with animated gradient */}
          <div className="relative mb-10 mt-4">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 rounded-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 rounded-2xl animate-gradient-x"></div>
            <div className="relative px-8 py-8 rounded-2xl backdrop-blur-sm border border-white/10 dark:border-gray-800/50">
              <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 dark:text-white mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                  Customize Your Sequence
                </span>
              </h1>
              <p className="text-xl text-center max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
                Drag and drop to reorder the stretches. Create your perfect routine with our premium selection of poses.
              </p>
              
              {/* Premium tag */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l.707.707.707-.707A1 1 0 0116 3v10a1 1 0 01-1 1h-3a1 1 0 01-1-1V3a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Premium
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            <div className="lg:w-1/3 xl:w-1/4 space-y-6">
              <div className="bg-white/90 dark:bg-gray-800/90 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-white/10 dark:border-gray-700/30 premium-shine relative overflow-hidden">
                {/* Premium corner decoration */}
                <div className="absolute top-0 right-0 w-32 h-32">
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-indigo-500/20 to-transparent"></div>
                </div>
                
                <div className="absolute -left-8 -bottom-8 w-16 h-16 rounded-full bg-indigo-500/10 blur-xl"></div>
                
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center relative z-10">
                  <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Benefits
                </h3>
                <ul className="space-y-3 relative z-10">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="ml-2 text-gray-600 dark:text-gray-300">Increases flexibility and joint range of motion</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="ml-2 text-gray-600 dark:text-gray-300">Improves posture and balance</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="ml-2 text-gray-600 dark:text-gray-300">Reduces muscle tension and stress</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="ml-2 text-gray-600 dark:text-gray-300">Enhances physical performance</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="ml-2 text-gray-600 dark:text-gray-300">Helps prevent injuries</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6 rounded-xl backdrop-blur-sm border border-white/10 dark:border-gray-700/30 premium-shine relative overflow-hidden">
                {/* Premium decorations */}
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-0 left-0 w-28 h-28 bg-indigo-500/10 rounded-full blur-xl"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
                </div>
                
                {/* Animated particle */}
                <div className="absolute right-6 top-10 w-2 h-2 bg-indigo-500/40 rounded-full animate-ping-slow"></div>
                
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center relative z-10">
                  <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  Quick Tips
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 relative z-10">For the best stretching experience:</p>
                <ul className="space-y-2 relative z-10">
                  <li className="flex items-start">
                    <span className="mr-2 font-bold text-indigo-500">•</span>
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Breathe deeply and relax into each stretch</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 font-bold text-indigo-500">•</span>
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Hold each position for the full duration</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 font-bold text-indigo-500">•</span>
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Never stretch to the point of pain</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 font-bold text-indigo-500">•</span>
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Stay hydrated before and after</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="lg:w-2/3 xl:w-3/4">
              <div className="mb-8 relative">
                {/* Premium border effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-3xl opacity-30 blur-sm animate-pulse"></div>
                
                {/* Stretch sequence container */}
                <div className="relative">
                  <DragList />
                </div>
                
                <div className="app-buttons flex justify-center pt-6 mt-8">
                  <button 
                    onClick={handleStartRoutine}
                    className="btn-primary text-xl px-12 py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
                    style={{ transform: 'translateZ(0)' }}
                    disabled={isTransitioning}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600"></span>
                    <span className="absolute inset-0 w-0 bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300 ease-out group-hover:w-full"></span>
                    <span className="relative z-10 flex items-center">
                      <svg className="w-7 h-7 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Start Stretch Routine
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <footer className="fixed bottom-0 left-0 right-0 text-center py-4 text-sm text-white border-t backdrop-blur-sm">
          <div className="container mx-auto flex flex-col items-center">
            <p className="mb-2">Crafted by Areeb 💖 with love for CodeCircuit</p>
            
            {/* Social links */}
            <div className="flex items-center gap-3 mt-1">
              <a 
                href="https://www.linkedin.com/in/areeb-abdul-ghani-aaa46a1b7/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 transition-colors"
                aria-label="LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a 
                href="https://x.com/AreebAbdulGhan1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 transition-colors"
                aria-label="Twitter/X"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="mailto:areebghani359@gmail.com" 
                className="text-white hover:text-white/80 transition-colors"
                aria-label="Email"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/>
                </svg>
              </a>
              <a 
                href="https://github.com/AreebAbdulGhani" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 transition-colors"
                aria-label="GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </footer>
        
        {/* Routine Player */}
        {showPlayer && routineSessionId && (
          <RoutinePlayer 
            onClose={handleCloseRoutine} 
            key={routineSessionId} 
          />
        )}
        
        {/* Settings Panel */}
        <SettingsPanel 
          isOpen={showSettings} 
          onClose={() => setShowSettings(false)} 
        />
      </div>
    </div>
  );
}

export default App;
