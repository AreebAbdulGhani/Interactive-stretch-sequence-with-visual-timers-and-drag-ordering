import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import useRoutineStore from '../store/routineStore';

const SettingsPanel = ({ isOpen, onClose }) => {
  const panelRef = useRef(null);
  const { routineSpeed, setRoutineSpeed, isDarkMode, toggleDarkMode } = useRoutineStore();
  
  // Animation for opening/closing the panel
  useEffect(() => {
    if (isOpen) {
      gsap.to(panelRef.current, {
        x: 0,
        duration: 0.5,
        ease: 'power3.out'
      });
    } else {
      gsap.to(panelRef.current, {
        x: '100%',
        duration: 0.4,
        ease: 'power2.in'
      });
    }
  }, [isOpen]);

  // Handle speed selection
  const handleSpeedChange = (speed) => {
    setRoutineSpeed(speed);
    
    // Animate the selected speed option
    gsap.fromTo(
      `.speed-option[data-speed="${speed}"]`,
      { scale: 1 },
      { 
        scale: 1.1, 
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut'
      }
    );
  };
  
  // Handle dark mode toggle
  const handleDarkModeToggle = () => {
    toggleDarkMode();
    
    // Animate the toggle switch
    gsap.to('.toggle-circle', {
      x: isDarkMode ? 0 : 22,
      duration: 0.3,
      ease: 'power2.inOut'
    });
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
          onClick={onClose}
        />
      )}
      
      <div
        ref={panelRef}
        className="fixed top-0 right-0 bottom-0 w-80 max-w-full bg-white dark:bg-gray-800 shadow-xl z-50 transform translate-x-full p-6 flex flex-col"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">Settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Routine Speed</h3>
          <div className="flex gap-3">
            {['slow', 'normal', 'fast'].map((speed) => (
              <button
                key={speed}
                className={`speed-option py-2 px-4 rounded-lg capitalize ${
                  routineSpeed === speed 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
                data-speed={speed}
                onClick={() => handleSpeedChange(speed)}
              >
                {speed}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Theme</h3>
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <button 
              onClick={handleDarkModeToggle}
              className={`w-12 h-6 rounded-full flex items-center p-1 ${
                isDarkMode ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div 
                className="toggle-circle w-4 h-4 bg-white rounded-full transform"
                style={{ transform: isDarkMode ? 'translateX(22px)' : 'translateX(0)' }}
              />
            </button>
          </div>
        </div>
        
        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>StrechFlow v1.0</p>
          <p className="mt-1">Crafted by Areeb 💖 CodeCircuit</p>
        </div>
      </div>
    </>
  );
};

export default SettingsPanel; 