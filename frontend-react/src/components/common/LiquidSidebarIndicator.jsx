import React, { useEffect, useRef } from 'react';

export const LiquidSidebarIndicator = ({ activeTab, tabRefs }) => {
  const indicatorRef = useRef(null);
  const prevTabRef = useRef(activeTab);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const el = tabRefs.current?.[activeTab];
    if (!el || !indicatorRef.current) return;

    const targetTop = el.offsetTop;
    const targetHeight = el.offsetHeight;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      indicatorRef.current.style.top = `${targetTop}px`;
      indicatorRef.current.style.height = `${targetHeight}px`;
      indicatorRef.current.style.left = '0px';
      indicatorRef.current.style.right = '0px';
      indicatorRef.current.style.opacity = '1';
      prevTabRef.current = activeTab;
      return;
    }

    const prevEl = tabRefs.current?.[prevTabRef.current];
    const prevTop = prevEl ? prevEl.offsetTop : targetTop;
    const isMovingDown = targetTop >= prevTop;
    prevTabRef.current = activeTab;

    if (prevTop === targetTop) return;

    const distance = Math.abs(targetTop - prevTop);
    const midTop = (prevTop + targetTop) / 2;

    // Organic teardrop contour depending on travel direction
    const teardropRadius = isMovingDown
      ? '35% 35% 65% 65% / 25% 25% 75% 75%'
      : '65% 65% 35% 35% / 75% 75% 25% 25%';

    const pillRadius = 'var(--border-radius-md, 10px)';

    // Liquid Water Drop Morphing Keyframes (Clearly Perceptible & Fluid)
    const keyframes = [
      // 0%: Full Resting Pill at Initial Option
      {
        top: `${prevTop}px`,
        height: `${targetHeight}px`,
        left: '0px',
        right: '0px',
        borderRadius: pillRadius,
        transform: 'scale(1, 1)',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.18))',
        opacity: 1,
      },
      // 20%: Pinches & Condenses into a round liquid droplet (clearly visible)
      {
        top: `${prevTop + (isMovingDown ? 6 : -6)}px`,
        height: '32px',
        left: 'calc(50% - 16px)',
        right: 'calc(50% - 16px)',
        borderRadius: '50%',
        transform: 'scale(0.85, 1.2)',
        filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.32))',
        opacity: 0.98,
      },
      // 55%: Mid-flight aerodynamic stretched water drop traveling along the track
      {
        top: `${midTop}px`,
        height: '38px',
        left: 'calc(50% - 14px)',
        right: 'calc(50% - 14px)',
        borderRadius: teardropRadius,
        transform: isMovingDown ? 'scale(0.72, 1.5) translateY(4px)' : 'scale(0.72, 1.5) translateY(-4px)',
        filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.4))',
        opacity: 1,
      },
      // 82%: Impact splash & horizontal liquid expansion on target option
      {
        top: `${targetTop + (isMovingDown ? 2 : -2)}px`,
        height: `${targetHeight * 0.92}px`,
        left: '4px',
        right: '4px',
        borderRadius: '14px',
        transform: 'scale(1.03, 0.92)',
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.22))',
        opacity: 1,
      },
      // 100%: Relaxes into full pristine capsule pill highlighting new option
      {
        top: `${targetTop}px`,
        height: `${targetHeight}px`,
        left: '0px',
        right: '0px',
        borderRadius: pillRadius,
        transform: 'scale(1, 1)',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.18))',
        opacity: 1,
      },
    ];

    // Deliberate, clearly perceptible timing so the droplet morph is enjoyed
    const duration = Math.min(800, Math.max(620, distance * 3.0));

    const anim = indicatorRef.current.animate(keyframes, {
      duration: duration,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'forwards',
    });

    anim.onfinish = () => {
      if (indicatorRef.current) {
        indicatorRef.current.style.top = `${targetTop}px`;
        indicatorRef.current.style.height = `${targetHeight}px`;
        indicatorRef.current.style.left = '0px';
        indicatorRef.current.style.right = '0px';
        indicatorRef.current.style.borderRadius = pillRadius;
        indicatorRef.current.style.transform = 'scale(1, 1)';
      }
    };
  }, [activeTab, tabRefs]);

  return (
    <div
      ref={indicatorRef}
      className="sidebar-active-indicator liquid-indicator"
      style={{
        position: 'absolute',
        left: '0px',
        right: '0px',
        background: 'var(--sidebar-active-bg)',
        boxShadow: 'var(--sidebar-active-shadow)',
        borderRadius: 'var(--border-radius-md)',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0,
        transformOrigin: 'center center',
        willChange: 'transform, top, left, right, border-radius',
      }}
    />
  );
};
