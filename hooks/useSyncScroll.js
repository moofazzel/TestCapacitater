import { useEffect, useRef } from "react";

export const useSyncHorizontalScroll = (elementRef1, elementRef2) => {
  const isSyncingScroll = useRef(false); // Flag to prevent infinite scroll loop

  useEffect(() => {
    const element1 = elementRef1.current;
    const element2 = elementRef2.current;

    const handleScroll = (source, target) => {
      if (isSyncingScroll.current) return;

      isSyncingScroll.current = true;
      target.scrollLeft = source.scrollLeft;

      setTimeout(() => {
        isSyncingScroll.current = false;
      }, 0); // Reset flag after sync
    };

    const handleElement1Scroll = () => {
      handleScroll(element1, element2);
    };

    const handleElement2Scroll = () => {
      handleScroll(element2, element1);
    };

    if (element1 && element2) {
      element1.addEventListener("scroll", handleElement1Scroll);
      element2.addEventListener("scroll", handleElement2Scroll);
    }

    return () => {
      if (element1 && element2) {
        element1.removeEventListener("scroll", handleElement1Scroll);
        element2.removeEventListener("scroll", handleElement2Scroll);
      }
    };
  }, [elementRef1, elementRef2]);
};

export const useSyncVerticalScroll = (elementRef1, elementRef2) => {
  const isSyncingScroll = useRef(false); // Flag to prevent infinite scroll loop

  useEffect(() => {
    const element1 = elementRef1.current;
    const element2 = elementRef2.current;

    const handleScroll = (source, target) => {
      if (isSyncingScroll.current) return;

      isSyncingScroll.current = true;
      target.scrollTop = source.scrollTop;

      setTimeout(() => {
        isSyncingScroll.current = false;
      }, 0); // Reset flag after sync
    };

    const handleElement1Scroll = () => {
      handleScroll(element1, element2);
    };

    const handleElement2Scroll = () => {
      handleScroll(element2, element1);
    };

    if (element1 && element2) {
      element1.addEventListener("scroll", handleElement1Scroll);
      element2.addEventListener("scroll", handleElement2Scroll);
    }

    return () => {
      if (element1 && element2) {
        element1.removeEventListener("scroll", handleElement1Scroll);
        element2.removeEventListener("scroll", handleElement2Scroll);
      }
    };
  }, [elementRef1, elementRef2]);
};
