import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

let currentVisiblePopover = null; // Track the currently open popover ID

const Popover = ({
  content,
  children,
  isAllocateResourceModalOpen,
  onTriggerClick,
  popoverId, // Unique ID for each popover
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const initialPositionRef = useRef(null);
  const isPositionLockedRef = useRef(false);

  const showDelay = 500;
  const hideDelay = 50;
  const showTimeout = useRef(null);
  const hideTimeout = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(false);
      currentVisiblePopover = null;
      initialPositionRef.current = null;
      isPositionLockedRef.current = false;
      setPosition({ x: 0, y: 0 });
      currentVisiblePopover = null; // Reset global popover ID on scroll
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isAllocateResourceModalOpen]);

  useEffect(() => {
    if (isAllocateResourceModalOpen) {
      setIsVisible(false);
      currentVisiblePopover = null;
      initialPositionRef.current = null;
      isPositionLockedRef.current = false;
      setPosition({ x: 0, y: 0 });
    }
  }, [isAllocateResourceModalOpen]);

  const handleMouseEnter = (event) => {
    if (isAllocateResourceModalOpen || currentVisiblePopover === popoverId)
      return;

    if (hideTimeout.current) clearTimeout(hideTimeout.current);

    showTimeout.current = setTimeout(() => {
      const targetRect = event.currentTarget?.getBoundingClientRect();
      const x = targetRect
        ? targetRect.left + targetRect.width / 2
        : event.clientX;
      const y = targetRect ? targetRect.bottom : event.clientY;

      initialPositionRef.current = { x, y };
      setPosition(initialPositionRef.current);
      isPositionLockedRef.current = true;

      setIsVisible(true);
      currentVisiblePopover = popoverId; // Set current popover as visible
    }, showDelay);
  };

  const handleTriggerMouseLeave = (event) => {
    const relatedTarget = event.relatedTarget;
    if (!relatedTarget?.closest?.(".popover-content")) {
      if (showTimeout.current) clearTimeout(showTimeout.current);

      hideTimeout.current = setTimeout(() => {
        setIsVisible(false);
        currentVisiblePopover = null; // Reset global popover ID when mouse leaves
      }, hideDelay);
    }
  };

  const handlePopoverMouseLeave = (event) => {
    const relatedTarget = event.relatedTarget;
    if (!relatedTarget?.closest?.(".popover-trigger")) {
      if (showTimeout.current) clearTimeout(showTimeout.current);

      hideTimeout.current = setTimeout(() => {
        setIsVisible(false);
        currentVisiblePopover = null; // Reset global popover ID on mouse leave
      }, hideDelay);
    }
  };

  const handleClick = () => {
    setIsVisible(false);
    currentVisiblePopover = null; // Reset on click
    if (onTriggerClick) onTriggerClick();
  };

  return (
    <div
      className="popover-trigger"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleTriggerMouseLeave}
      onClick={handleClick}
      style={{ display: "inline-block" }}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="popover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed z-[100] popover-content"
            style={{
              top: `${position.y}px`,
              left: `${position.x}px`,
              pointerEvents: "auto",
            }}
            onMouseEnter={() => {
              if (hideTimeout.current) clearTimeout(hideTimeout.current);
            }}
            onMouseLeave={handlePopoverMouseLeave}
          >
            <div className=" bg-color9 deal-hover-shape-path max-w-[330px] max-h-[480px]  overflow-y-auto">
              <div className="pl-6 pr-1 overflow-hidden overflow-y-auto pt-14 pb-7 top-10 left-6">
                {content}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Popover;
