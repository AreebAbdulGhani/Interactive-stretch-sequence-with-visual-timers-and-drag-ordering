import { useState, useEffect, useRef } from 'react';
import TimerCircle from './TimerCircle';
import useRoutineStore from '../store/routineStore';

// Define possible states
const STATES = {
  GET_READY: 'get_ready',
  PLAYING: 'playing',
  TRANSITION: 'transition',
  COMPLETE: 'complete'
};

const RoutinePlayer = ({ onClose }) => {
  const { poses, currentPoseIndex, isPlaying, nextPose, pauseRoutine, resumeRoutine, resetRoutine } = useRoutineStore();
  // Single state that controls what's displayed
  const [playerState, setPlayerState] = useState(STATES.GET_READY);
  const [nextPoseName, setNextPoseName] = useState('');
  
  // Ref to prevent "Get Ready" screen from reappearing
  const hasCompletedInitialSetupRef = useRef(false);
  
  const currentPose = poses[currentPoseIndex];
  
  // Initial "Get Ready" screen setup - runs only once when component mounts
  useEffect(() => {
    // Only run if we're in GET_READY state and haven't completed setup
    if (playerState === STATES.GET_READY && !hasCompletedInitialSetupRef.current) {
      const timer = setTimeout(() => {
        setPlayerState(STATES.PLAYING);
        hasCompletedInitialSetupRef.current = true;
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);  // Empty dependency array ensures this runs only once on mount
  
  // Force player state to PLAYING if user pauses/resumes and somehow we're in GET_READY state
  useEffect(() => {
    // If user has interacted with pause/resume and we're not in PLAYING state
    if (hasCompletedInitialSetupRef.current && playerState === STATES.GET_READY) {
      setPlayerState(STATES.PLAYING);
    }
  }, [isPlaying, playerState]);
  
  // Add body class
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);
  
  // Simple pause/resume toggle - never changes playerState
  const handlePlayPause = () => {
    // Make sure we're in PLAYING state
    if (playerState !== STATES.PLAYING) {
      setPlayerState(STATES.PLAYING);
    }
    
    if (isPlaying) {
      pauseRoutine();
    } else {
      resumeRoutine(); 
    }
  };
  
  // Timer complete handler
  const handleTimerComplete = () => {
    if (currentPoseIndex === poses.length - 1) {
      setPlayerState(STATES.COMPLETE);
    } else {
      // Show transition notification
      const nextPoseIndex = currentPoseIndex + 1;
      if (nextPoseIndex < poses.length) {
        setNextPoseName(poses[nextPoseIndex].name);
        setPlayerState(STATES.TRANSITION);
        
        // Auto-hide transition after 2 seconds
        setTimeout(() => {
          setPlayerState(STATES.PLAYING);
          nextPose(); // Move to next pose
        }, 2000);
      } else {
        nextPose();
      }
    }
  };
  
  // Close handler
  const handleClose = () => {
    resetRoutine();
    onClose();
  };
  
  // Restart handler
  const handleRestart = () => {
    resetRoutine();
    hasCompletedInitialSetupRef.current = false;
    setPlayerState(STATES.GET_READY);
    
    // Auto-hide get ready after 3 seconds
    setTimeout(() => {
      setPlayerState(STATES.PLAYING);
      hasCompletedInitialSetupRef.current = true;
    }, 3000);
  };

  // Progress indicator
  const ProgressIndicator = () => {
    if (!poses || poses.length === 0) return null;
    
    return (
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center justify-center bg-white/60 dark:bg-gray-800/60 rounded-full px-4 py-2 backdrop-blur-sm shadow-lg">
          <div className="flex space-x-1">
            {poses.map((pose, index) => (
              <div 
                key={index}
                className={`h-2 w-8 rounded-full transition-all duration-300 ${
                  index === currentPoseIndex ? 
                    'bg-indigo-600 w-12' : 
                    index < currentPoseIndex ? 
                      'bg-indigo-400' : 
                      'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentPoseIndex + 1}/{poses.length}
          </span>
        </div>
      </div>
    );
  };
  
  // Render different UI based on player state
  const renderContent = () => {
    // Make sure we never go back to GET_READY after completing initial setup
    if (playerState === STATES.GET_READY && hasCompletedInitialSetupRef.current) {
      return renderPlayingContent();
    }
    
    switch (playerState) {
      case STATES.GET_READY:
        return (
          <div className="bg-white/90 dark:bg-gray-800/90 p-10 rounded-xl text-center shadow-lg max-w-lg w-full backdrop-blur-sm animate-fadeIn">
            <div className="rounded-full mx-auto mb-6 bg-indigo-100 dark:bg-indigo-900/30 w-24 h-24 flex items-center justify-center">
              <svg className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-4xl font-bold mb-5 text-indigo-600 dark:text-indigo-400">Get Ready!</h2>
            <p className="text-xl">Your stretch routine is about to begin...</p>
            <div className="mt-8 w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full w-0 rounded-full animate-progress"></div>
            </div>
          </div>
        );
      
      case STATES.TRANSITION:
        return (
          <div className="bg-white/90 dark:bg-gray-800/90 p-10 rounded-xl text-center shadow-lg max-w-lg w-full backdrop-blur-sm animate-fadeIn">
            <div className="rounded-full mx-auto mb-6 bg-green-100 dark:bg-green-900/30 w-24 h-24 flex items-center justify-center">
              <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-3 text-green-600 dark:text-green-400">Well done!</h2>
            <p className="text-xl mb-6">Moving to next stretch...</p>
            <div className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">{nextPoseName}</div>
            <div className="mt-6 w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden">
              <div className="bg-green-600 h-full rounded-full animate-progress-fast"></div>
            </div>
          </div>
        );
        
      case STATES.COMPLETE:
        return (
          <div className="bg-white/90 dark:bg-gray-800/90 p-12 rounded-xl text-center shadow-lg max-w-lg w-full backdrop-blur-sm animate-fadeIn">
            <div className="rounded-full mx-auto mb-8 bg-green-100 dark:bg-green-900/30 w-32 h-32 flex items-center justify-center">
              <svg className="w-16 h-16 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-5xl font-bold mb-5 text-green-600 dark:text-green-400">Great Job!</h2>
            <p className="text-xl mb-8">You've completed your stretch routine!</p>
            
            <div className="flex gap-6 justify-center">
              <button 
                onClick={handleRestart}
                className="bg-indigo-600 dark:bg-indigo-700 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Restart
              </button>
              <button 
                onClick={handleClose}
                className="bg-gray-600 dark:bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        );
        
      case STATES.PLAYING:
        return renderPlayingContent();
        
      default:
        return null;
    }
  };

  // Background elements for visual interest - enhanced with more decorative elements
  const BackgroundElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"></div>
      
      {/* Decorative blobs */}
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[50%] rounded-full bg-indigo-500/10 blur-3xl"></div>
      <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[50%] rounded-full bg-purple-500/10 blur-3xl"></div>
      
      {/* Animated pulse circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl max-h-5xl">
        <div className="absolute w-full h-full rounded-full border-[15px] border-indigo-500/5 animate-ping-slow"></div>
        <div className="absolute w-full h-full rounded-full border-[8px] border-purple-500/5 animate-ping-slow" style={{animationDelay: '1s'}}></div>
      </div>
      
      {/* Stars */}
      {[...Array(6)].map((_, i) => (
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
      
      {/* Hearts */}
      {[...Array(3)].map((_, i) => (
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
      
      {/* Lungs */}
      {[...Array(2)].map((_, i) => (
        <div 
          key={`lung-${i}`}
          className="absolute" 
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
      ))}
      
      {/* Premium grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(to right, #00000010 1px, transparent 1px),
              linear-gradient(to bottom, #00000010 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>
    </div>
  );
  
  // Dedicated function for rendering playing content to avoid code duplication
  const renderPlayingContent = () => {
    if (currentPose) {
      return (
        <div className="flex flex-col md:flex-row max-w-5xl w-full gap-8">
          {/* Left panel with timer */}
          <div className="bg-white/90 dark:bg-gray-800/90 p-8 rounded-xl shadow-lg backdrop-blur-sm w-full md:w-[500px]">
            <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600 dark:text-indigo-400">{currentPose.name}</h2>
            
            <div className="w-full h-[350px] mb-6 bg-gray-200/50 dark:bg-gray-700/50 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
              <TimerCircle 
                duration={currentPose.duration} 
                onComplete={handleTimerComplete} 
                key={`timer-${currentPoseIndex}`}
              />
            </div>
            
            <div className="flex justify-center">
              <button 
                onClick={handlePlayPause}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg text-xl transition-colors w-full flex items-center justify-center gap-2"
              >
                {isPlaying ? (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pause
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Resume
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Right panel with description and next pose */}
          <div className="flex flex-col w-full">
            <div className="bg-white/90 dark:bg-gray-800/90 p-8 rounded-xl shadow-lg backdrop-blur-sm flex-grow">
              <h3 className="text-xl font-medium mb-3 text-gray-700 dark:text-gray-300">Instructions</h3>
              <p className="text-xl mb-6 text-gray-600 dark:text-gray-400">{currentPose.description}</p>
              
              <div className="mt-4">
                <h3 className="text-xl font-medium mb-3 text-gray-700 dark:text-gray-300">Tips</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">Breathe deeply and relax into the pose</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">Hold the position for the full duration</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">If you feel pain, ease back slightly</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {currentPoseIndex < poses.length - 1 && (
              <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6 rounded-xl mt-4 backdrop-blur-sm">
                <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">Coming up next</h3>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <span className="block text-lg font-medium text-indigo-600 dark:text-indigo-400">
                      {poses[currentPoseIndex + 1].name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {poses[currentPoseIndex + 1].duration} seconds
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-white/90 dark:bg-gray-800/90 p-8 rounded-xl text-center shadow-lg backdrop-blur-sm">
        <p className="text-xl">No poses available</p>
        <button 
          onClick={handleClose}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg mt-4 hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
      </div>
    );
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
      {/* Enhanced background */}
      <BackgroundElements />
      
      {/* Top progress indicator - only show during playing state */}
      {playerState === STATES.PLAYING && <ProgressIndicator />}
      
      {/* Back/Close button */}
      <button 
        onClick={handleClose}
        className="absolute top-6 left-6 z-50 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white bg-white/60 dark:bg-gray-800/60 rounded-full p-2 transition-colors backdrop-blur-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {/* Main content */}
      <div className="px-4 z-10">
        {renderContent()}
      </div>
    </div>
  );
};

export default RoutinePlayer; 