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
      ? '30% 30% 70% 70% / 20% 20% 80% 80%'
      : '70% 70% 30% 30% / 80% 80% 20% 20%';

    const pillRadius = 'var(--border-radius-md, 10px)';

    // Liquid Water Drop Morphing Keyframes with Motion Blur & Extended Flight
    const keyframes = [
      // 0%: Full Resting Pill at Initial Option (Crystal Clear)
      {
        top: `${prevTop}px`,
        height: `${targetHeight}px`,
        left: '0px',
        right: '0px',
        borderRadius: pillRadius,
        transform: 'scale(1, 1)',
        filter: 'blur(0px) drop-shadow(0 2px 4px rgba(0,0,0,0.18))',
        opacity: 1,
      },
      // 18%: Surface tension collapse into a round liquid droplet (initiating motion blur)
      {
        top: `${prevTop + (isMovingDown ? 8 : -8)}px`,
        height: '32px',
        left: 'calc(50% - 16px)',
        right: 'calc(50% - 16px)',
        borderRadius: '50%',
        transform: 'scale(0.85, 1.25)',
        filter: 'blur(1.5px) drop-shadow(0 6px 14px rgba(0,0,0,0.32))',
        opacity: 0.96,
      },
      // 45%: Mid-flight peak velocity with pronounced fluid motion blur & vertical stretch
      {
        top: `${midTop}px`,
        height: '40px',
        left: 'calc(50% - 14px)',
        right: 'calc(50% - 14px)',
        borderRadius: teardropRadius,
        transform: isMovingDown ? 'scale(0.68, 1.65) translateY(6px)' : 'scale(0.68, 1.65) translateY(-6px)',
        filter: 'blur(4px) drop-shadow(0 10px 22px rgba(0,0,0,0.45))',
        opacity: 1,
      },
      // 78%: Approaching target, decelerating and blur resolving
      {
        top: `${targetTop + (isMovingDown ? -6 : 6)}px`,
        height: '34px',
        left: 'calc(50% - 16px)',
        right: 'calc(50% - 16px)',
        borderRadius: '50%',
        transform: 'scale(0.9, 1.15)',
        filter: 'blur(1.5px) drop-shadow(0 6px 12px rgba(0,0,0,0.25))',
        opacity: 1,
      },
      // 88%: Impact splash & horizontal liquid expansion on target option
      {
        top: `${targetTop + (isMovingDown ? 2 : -2)}px`,
        height: `${targetHeight * 0.92}px`,
        left: '4px',
        right: '4px',
        borderRadius: '14px',
        transform: 'scale(1.03, 0.92)',
        filter: 'blur(0.5px) drop-shadow(0 4px 8px rgba(0,0,0,0.22))',
        opacity: 1,
      },
      // 100%: Relaxes into pristine capsule pill (Zero Blur)
      {
        top: `${targetTop}px`,
        height: `${targetHeight}px`,
        left: '0px',
        right: '0px',
        borderRadius: pillRadius,
        transform: 'scale(1, 1)',
        filter: 'blur(0px) drop-shadow(0 2px 4px rgba(0,0,0,0.18))',
        opacity: 1,
      },
    ];

    // Extended cinematic duration for rich liquid appreciation (920ms - 1250ms)
    const duration = Math.min(1250, Math.max(920, distance * 4.2));

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
        indicatorRef.current.style.filter = 'blur(0px) drop-shadow(0 2px 4px rgba(0,0,0,0.18))';
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
        willChange: 'transform, top, left, right, border-radius, filter',
      }}
    />
  );
};
