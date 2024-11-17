// import { useState, useEffect } from "react";

// export const useMousePosition = (containerRef) => {
//   const [position, setPosition] = useState({ x: 0, y: 0 });

//   useEffect(() => {
//     const updateMousePosition = (e) => {
//       if (!containerRef.current) return;

//       const rect = containerRef.current.getBoundingClientRect();
//       const x = e.clientX - rect.left + containerRef.current.scrollLeft;
//       const y = e.clientY - rect.top + containerRef.current.scrollTop;

//       setPosition({ x, y });
//     };

//     const container = containerRef.current;
//     if (container) {
//       container.addEventListener("mousemove", updateMousePosition);
//       container.addEventListener("mousedown", updateMousePosition);
//     }

//     return () => {
//       if (container) {
//         container.removeEventListener("mousemove", updateMousePosition);
//         container.removeEventListener("mousedown", updateMousePosition);
//       }
//     };
//   }, [containerRef]);

//   return position;
// };

import { useState, useEffect } from "react";

export const useMousePosition = (containerRef) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left; // Calculate X relative to the container
      const y = event.clientY - rect.top; // Calculate Y relative to the container

      setPosition({ x, y });
    };

    const container = containerRef.current;

    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [containerRef]);

  return position;
};
