import { useMousePosition } from "@/hooks/useMousePosition";
import { useEffect, useState } from "react";

export const MouseTracker = ({
  containerWrapperRef,
  containerRef,
  resourcesRef,
}) => {
  const position = useMousePosition(containerWrapperRef); // Track mouse position inside the wrapper
  const [calendarBounds, setCalendarBounds] = useState({ top: 0, height: 0 });
  const [isMouseInside, setIsMouseInside] = useState(false);

  useEffect(() => {
    // Store current ref value to prevent issues with ref being null during cleanup
    const containerWrapper = containerWrapperRef.current;

    if (containerWrapper) {
      // Query the calendar grid section
      const gridCalendar = containerWrapper.querySelector(".mouseTracker");
      if (gridCalendar) {
        const rect = gridCalendar.getBoundingClientRect();
        const containerRect = containerWrapper.getBoundingClientRect();
        setCalendarBounds({
          top: rect.top - containerRect.top, // Adjust relative to container
          height: rect.height, // Ensure the height stays within the container
        });
      }

      // Check if mouse is inside the containerRef or resourcesRef
      const handleMouseMove = (event) => {
        if (containerRef.current && resourcesRef.current) {
          const containerRect = containerRef.current.getBoundingClientRect();
          const resourcesRect = resourcesRef.current.getBoundingClientRect();

          // Check if mouse is inside either the containerRef or resourcesRef
          const isInsideContainer =
            event.clientY >= containerRect.top &&
            event.clientY <= containerRect.bottom &&
            event.clientX >= containerRect.left &&
            event.clientX <= containerRect.right;

          const isInsideResources =
            event.clientY >= resourcesRect.top &&
            event.clientY <= resourcesRect.bottom &&
            event.clientX >= resourcesRect.left &&
            event.clientX <= resourcesRect.right;

          setIsMouseInside(isInsideContainer || isInsideResources); // Show cursor when mouse is inside
        }
      };

      containerWrapper.addEventListener("mousemove", handleMouseMove);

      return () => {
        // Only remove event listener if containerWrapper is not null
        if (containerWrapper) {
          containerWrapper.removeEventListener("mousemove", handleMouseMove);
        }
      };
    }
  }, [containerWrapperRef, containerRef, resourcesRef]);

  // If the mouse is not inside containerRef or resourcesRef, don't show the cursor lines
  if (!isMouseInside) return null;

  return (
    <>
      {/* Vertical line */}
      <div
        className="absolute z-[50] w-px bg-black pointer-events-none"
        style={{
          left: `${position.x}px`,
          top: `${calendarBounds.top}px`, // Start at the top of the calendar
          height: `${calendarBounds.height}px`, // Constrain to calendar height
        }}
      ></div>
      {/* Horizontal line */}
      <div
        className="absolute z-[50] h-px bg-black pointer-events-none"
        style={{
          top: `${position.y}px`,
          left: 0,
          right: 0,
        }}
      ></div>
    </>
  );
};
