import { useEffect, useState } from "react";

const ANIMATION_DURATION = 10000; // 10 seconds

const useColourAnimation = (startColor: string, endColor: string) => {
  const [currentColor, setCurrentColor] = useState(startColor);
  const [startColour, setStartColour] = useState(startColor);
  const [endColour, setEndColour] = useState(endColor);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let start: number;
    let rDiff =
      parseInt(endColour.substring(1, 3), 16) -
      parseInt(startColour.substring(1, 3), 16);
    let gDiff =
      parseInt(endColour.substring(3, 5), 16) -
      parseInt(startColour.substring(3, 5), 16);
    let bDiff =
      parseInt(endColour.substring(5, 7), 16) -
      parseInt(startColour.substring(5, 7), 16);

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      let progress = timestamp - start;
      let r = Math.round(
        parseInt(startColour.substring(1, 3), 16) +
          (rDiff * progress) / ANIMATION_DURATION
      ).toString(16);
      let g = Math.round(
        parseInt(startColour.substring(3, 5), 16) +
          (gDiff * progress) / ANIMATION_DURATION
      ).toString(16);
      let b = Math.round(
        parseInt(startColour.substring(5, 7), 16) +
          (bDiff * progress) / ANIMATION_DURATION
      ).toString(16);

      // Pad with leading zeros if necessary
      r = r.padStart(2, "0");
      g = g.padStart(2, "0");
      b = b.padStart(2, "0");
      setCurrentColor(`#${r}${g}${b}`);

      if (progress >= ANIMATION_DURATION) {
        start = 0;
        setStartColour(endColour);
        setEndColour(startColour);
      }
      window.requestAnimationFrame(animate);
    };

    if (!mounted) return;
    window.requestAnimationFrame(animate);
  }, [startColour, endColour, mounted]);

  return currentColor;
};

export default useColourAnimation;
