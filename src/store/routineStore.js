import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialStretchPoses } from '../data/mockData';

// Helper to detect system preference for dark mode
const getSystemPreference = () => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Apply dark mode to document
const applyDarkMode = isDark => {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const useRoutineStore = create(
  persist(
    (set, get) => ({
      poses: initialStretchPoses,
      currentPoseIndex: -1, // -1 means not started
      isPlaying: false,
      routineSpeed: 'normal', // slow, normal, fast
      isDarkMode: false, // Default to light mode
      errorState: null,
      
      // Actions
      reorderPoses: (startIndex, endIndex) => 
        set((state) => {
          try {
            const newPoses = Array.from(state.poses);
            const [removed] = newPoses.splice(startIndex, 1);
            newPoses.splice(endIndex, 0, removed);
            return { poses: newPoses, errorState: null };
          } catch (error) {
            console.error("Error reordering poses:", error);
            return { errorState: "Failed to reorder poses" };
          }
        }),
      
      startRoutine: () => {
        try {
          console.log("Starting routine...");
          // Ensure we have valid poses before starting
          const poses = get().poses;
          
          if (!poses || poses.length === 0) {
            console.error("Cannot start routine: no poses available");
            set({ errorState: "No poses available to start routine" });
            return;
          }
          
          // Reset and start with first pose
          set({ 
            currentPoseIndex: 0, 
            isPlaying: true,
            errorState: null
          });
          
          console.log("Routine started with pose index 0");
        } catch (error) {
          console.error("Error starting routine:", error);
          set({ errorState: "Failed to start routine" });
        }
      },
      
      pauseRoutine: () => 
        set((state) => {
          try {
            return { isPlaying: false, errorState: null };
          } catch (error) {
            console.error("Error pausing routine:", error);
            return { errorState: "Failed to pause routine" };
          }
        }),
      
      resumeRoutine: () => 
        set((state) => {
          try {
            return { isPlaying: true, errorState: null };
          } catch (error) {
            console.error("Error resuming routine:", error);
            return { errorState: "Failed to resume routine" };
          }
        }),
      
      nextPose: () => 
        set((state) => {
          try {
            console.log(`Moving from pose ${state.currentPoseIndex} to ${state.currentPoseIndex + 1}`);
            
            if (state.currentPoseIndex < state.poses.length - 1) {
              return { currentPoseIndex: state.currentPoseIndex + 1, errorState: null };
            }
            
            // End of routine
            console.log("End of routine reached");
            return { currentPoseIndex: state.poses.length - 1, isPlaying: false, errorState: null };
          } catch (error) {
            console.error("Error moving to next pose:", error);
            return { errorState: "Failed to move to next pose" };
          }
        }),
      
      resetRoutine: () => 
        set({ currentPoseIndex: -1, isPlaying: false, errorState: null }),
      
      setRoutineSpeed: (speed) => 
        set((state) => {
          try {
            if (["slow", "normal", "fast"].includes(speed)) {
              return { routineSpeed: speed, errorState: null };
            }
            throw new Error("Invalid speed setting");
          } catch (error) {
            console.error("Error setting routine speed:", error);
            return { errorState: "Invalid speed setting" };
          }
        }),
      
      toggleDarkMode: () => 
        set((state) => {
          const newDarkMode = !state.isDarkMode;
          applyDarkMode(newDarkMode);
          return { isDarkMode: newDarkMode };
        }),
        
      clearError: () => 
        set({ errorState: null }),
        
      initAppearance: () => {
        const isDark = get().isDarkMode;
        applyDarkMode(isDark);
      }
    }),
    {
      name: 'stretch-routine-storage', // Name for localStorage
      partialize: (state) => ({ 
        // Only persist these values
        isDarkMode: state.isDarkMode,
        poses: state.poses
      })
    }
  )
);

// Initialize dark mode on first load
if (typeof window !== 'undefined') {
  setTimeout(() => {
    useRoutineStore.getState().initAppearance();
  }, 0);
}

export default useRoutineStore; 