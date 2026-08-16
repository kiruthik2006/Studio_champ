import React, { useRef, useEffect } from 'react';
import { animateWithMotionBlur } from '../../utils/motionBlur';

/**
 * Reusable MotionBlur React Wrapper Component.
 * 
 * Wrap any element to endow it with temporal sampling motion blur.
 * 
 * Usage:
 * <MotionBlur
 *   trigger={someState}
 *   keyframes={[...]}
 *   duration={800}
 *   copies={4}
 * >
 *   <div className="my-moving-element" />
 * </MotionBlur>
 */
export const MotionBlur = ({
  children,
  trigger,
  keyframes,
  options = {},
  className = '',
  style = {},
}) => {
  const childRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!childRef.current || !keyframes || keyframes.length === 0) return;

    if (animRef.current) {
      animRef.current.cancel();
    }

    animRef.current = animateWithMotionBlur(childRef.current, keyframes, options);

    return () => {
      if (animRef.current) {
        animRef.current.cancel();
      }
    };
  }, [trigger]);

  return (
    <div
      style={{ position: 'relative', display: 'inline-block', ...style }}
      className={`motion-blur-container ${className}`}
    >
      {React.isValidElement(children)
        ? React.cloneElement(children, { ref: childRef })
        : <div ref={childRef}>{children}</div>
      }
    </div>
  );
};

/**
 * Custom React Hook for easily applying motion blur to any ref.
 */
export const useMotionBlur = () => {
  const animate = (element, keyframes, options = {}) => {
    return animateWithMotionBlur(element, keyframes, options);
  };

  return { animate };
};
