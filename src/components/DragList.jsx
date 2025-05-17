import { useEffect, memo, useCallback, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { gsap } from 'gsap';
import StretchCard from './StretchCard';
import useRoutineStore from '../store/routineStore';

// Memoize the stretch card for better performance
const MemoizedStretchCard = memo(StretchCard);

const DragList = () => {
  const { poses, reorderPoses } = useRoutineStore();
  const containerRef = useRef(null);
  const scrolling = useRef(false);
  const lastScrollPosition = useRef(0);
  const scrollTimeout = useRef(null);

  // Apply dark mode class based on store state
  const isDarkMode = useRoutineStore(state => state.isDarkMode);
  
  useEffect(() => {
    // Apply/remove dark mode class to body
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  // Use useCallback to prevent unnecessary recreation of handler functions
  const handleDragEnd = useCallback((result) => {
    // Dropped outside the list
    if (!result.destination) return;
    
    // Reorder the poses in the store
    reorderPoses(result.source.index, result.destination.index);
    
    // Simplified animation for better performance - less properties to animate
    gsap.to(`[data-rbd-draggable-id="${result.draggableId}"] .card`, {
      scale: 1,
      duration: 0.2,
      clearProps: 'scale'
    });

    // Reset other cards with minimal animation
    gsap.to('.card:not(.is-dragging)', {
      scale: 1,
      duration: 0.2,
      clearProps: 'scale'
    });
  }, [reorderPoses]);

  const handleDragStart = useCallback((result) => {
    // Minimal effects for better performance - only scale
    gsap.set(`[data-rbd-draggable-id="${result.draggableId}"] .card`, {
      scale: 1.02,
      zIndex: 10
    });

    // Reduce effect on other cards
    gsap.to('.card:not(.is-dragging)', {
      scale: 0.98,
      duration: 0.2
    });

    // No container effects for better performance
  }, []);

  // Call useEffect to set up optimized scroll behavior
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const leftButton = container.querySelector('.scroll-button-left');
    const rightButton = container.querySelector('.scroll-button-right');
    
    // More efficient scroll handling
    const handleScrollLeft = () => {
      if (scrolling.current) return;
      scrolling.current = true;
      
      // Use a fixed scroll amount for consistency
      const scrollAmount = Math.min(250, container.offsetWidth * 0.3);
      container.scrollBy({ 
        left: -scrollAmount, 
        behavior: 'smooth' 
      });
      
      // Prevent rapid successive scrolls
      setTimeout(() => {
        scrolling.current = false;
      }, 300);
    };
    
    const handleScrollRight = () => {
      if (scrolling.current) return;
      scrolling.current = true;
      
      // Use a fixed scroll amount for consistency
      const scrollAmount = Math.min(250, container.offsetWidth * 0.3);
      container.scrollBy({ 
        left: scrollAmount, 
        behavior: 'smooth' 
      });
      
      // Prevent rapid successive scrolls
      setTimeout(() => {
        scrolling.current = false;
      }, 300);
    };
    
    // Throttle scroll button updates to improve performance
    const updateScrollButtons = () => {
      if (scrollTimeout.current) return;
      
      scrollTimeout.current = setTimeout(() => {
        if (leftButton && rightButton) {
          leftButton.style.opacity = container.scrollLeft > 10 ? '1' : '0.3';
          rightButton.style.opacity = 
            container.scrollLeft < (container.scrollWidth - container.offsetWidth - 10) 
              ? '1' 
              : '0.3';
        }
        scrollTimeout.current = null;
      }, 100);
    };
    
    // Add click events to scroll buttons
    if (leftButton) {
      leftButton.addEventListener('click', handleScrollLeft);
    }
    
    if (rightButton) {
      rightButton.addEventListener('click', handleScrollRight);
    }
    
    // Add keyboard navigation with throttling
    const handleKeyDown = (e) => {
      if (scrolling.current) return;
      
      if (e.key === 'ArrowLeft') handleScrollLeft();
      if (e.key === 'ArrowRight') handleScrollRight();
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Optimized mouse wheel handling
    const handleWheel = (e) => {
      // Skip small deltas for smoother scrolling
      if (Math.abs(e.deltaY) < 5) return;
      
      if (e.deltaY !== 0) {
        e.preventDefault();
        
        // Optimized scroll behavior - smooth only small distances
        const scrollAmount = e.deltaY * 0.4;
        container.scrollBy({
          left: scrollAmount,
          behavior: Math.abs(scrollAmount) < 50 ? 'smooth' : 'auto'
        });
        
        // Update scroll buttons less frequently during scroll
        if (!scrollTimeout.current) {
          updateScrollButtons();
        }
      }
    };
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    // Optimized touch scroll handling
    let startX = 0;
    let startTime = 0;
    let isSwiping = false;
    
    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startTime = Date.now();
      isSwiping = true;
      
      // Store the current scroll position
      lastScrollPosition.current = container.scrollLeft;
    };
    
    const handleTouchMove = (e) => {
      if (!isSwiping) return;
      
      const currentX = e.touches[0].clientX;
      const diff = startX - currentX;
      
      // Only scroll if meaningful movement detected
      if (Math.abs(diff) > 5) {
        // Prevent page scroll
        e.preventDefault();
        
        // Directly set scrollLeft instead of scrollBy for better performance
        container.scrollLeft = lastScrollPosition.current + diff;
      }
    };
    
    const handleTouchEnd = (e) => {
      if (!isSwiping) return;
      
      const endTime = Date.now();
      const timeElapsed = endTime - startTime;
      
      // Apply momentum based on speed
      if (timeElapsed < 200) {
        const lastDiff = startX - (e.changedTouches[0]?.clientX || startX);
        const speed = lastDiff / timeElapsed;
        
        const momentum = speed * 100; // Adjust this multiplier as needed
        container.scrollBy({
          left: momentum,
          behavior: 'smooth'
        });
      }
      
      isSwiping = false;
      
      // Update button visibility after touch ends
      updateScrollButtons();
    };
    
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    
    // Throttled scroll event
    container.addEventListener('scroll', updateScrollButtons);
    
    // Initial update
    updateScrollButtons();
    
    // Initial scroll to middle position - but only after a delay to reduce initial load
    setTimeout(() => {
      if (container.scrollWidth > container.offsetWidth) {
        // Set to 0 to show the first pose initially
        container.scrollLeft = 0;
        updateScrollButtons();
      }
    }, 500);
    
    return () => {
      if (leftButton) leftButton.removeEventListener('click', handleScrollLeft);
      if (rightButton) rightButton.removeEventListener('click', handleScrollRight);
      document.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('scroll', updateScrollButtons);
      
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  // Simpler version of Premium Decorations for better performance
  const PremiumDecorations = memo(() => (
    <>
      {/* Only one pulse indicator */}
      <div className="absolute top-6 right-6 w-3 h-3 bg-indigo-500 rounded-full animate-ping-slow opacity-70"></div>
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-br-3xl"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-tl-3xl"></div>
    </>
  ));

  return (
    <DragDropContext 
      onDragEnd={handleDragEnd} 
      onDragStart={handleDragStart}
    >
      <Droppable 
        droppableId="droppable-poses" 
        direction="horizontal"
        ignoreContainerClipping={false}
      >
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={(el) => {
              provided.innerRef(el);
              containerRef.current = el;
            }}
            className={`droppable-container p-6 md:p-8 rounded-3xl ${
              snapshot.isDraggingOver 
                ? 'bg-gray-50/80 dark:bg-gray-900/50 shadow-lg' 
                : 'bg-white/50 dark:bg-gray-800/30 shadow-md'
            } backdrop-blur-lg transition-all duration-300 min-h-[450px] relative premium-shine force-gpu`}
            style={{
              overflowX: 'auto',
              overflowY: 'hidden',
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x mandatory',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            }}
          >
            {/* Hide scrollbar for Chrome, Safari and Opera */}
            <style jsx>{`
              .droppable-container::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {/* Add scroll indicators */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/90 rounded-full w-10 h-10 flex items-center justify-center z-20 shadow-md cursor-pointer hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-110 active:scale-95 scroll-button-left">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            
            <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/90 rounded-full w-10 h-10 flex items-center justify-center z-20 shadow-md cursor-pointer hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-110 active:scale-95 scroll-button-right">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            
            {/* Simpler premium decorations */}
            <PremiumDecorations />
            
            {/* Simple instruction */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/70 dark:bg-gray-800/70 px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 backdrop-blur-sm shadow-sm flex items-center">
              <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <span>Drag to reorder</span>
            </div>

            {/* Content container with improved drag area */}
            <div 
              className="relative flex items-center py-6 mt-6 force-gpu"
              style={{ 
                minWidth: 'min-content', 
                gap: '1.5rem'
              }}
            >
              {poses.map((pose, index) => (
                <Draggable 
                  key={pose.id} 
                  draggableId={pose.id} 
                  index={index}
                >
                  {(provided, snapshot) => {
                    // Simpler style with fewer properties
                    const dragStyle = {
                      ...provided.draggableProps.style,
                      touchAction: 'none'
                    };
                    
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={snapshot.isDragging ? 'is-dragging z-10' : ''}
                        style={dragStyle}
                        data-is-dragging={snapshot.isDragging}
                      >
                        <MemoizedStretchCard
                          pose={pose}
                          index={index}
                          isDragging={snapshot.isDragging}
                        />
                      </div>
                    );
                  }}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default memo(DragList); // Memoize the component for better performance 