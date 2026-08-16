import React, { useEffect, useRef } from 'react';

export const LiquidSidebarIndicator = ({ activeTab, tabRefs }) => {
  const containerRef = useRef(null);
  const headRef = useRef(null);
  const trailRefs = useRef([]);
  const prevTabRef = useRef(activeTab);
  const isFirstRender = useRef(true);

  // 4 progressive temporal ghost layers for authentic motion blur sampling
  const TRAILS = [
    { opacity: 0.32, width: 44 },
    { opacity: 0.20, width: 40 },
    { opacity: 0.12, width: 36 },
    { opacity: 0.05, width: 32 },
  ];

  useEffect(() => {
    const el = tabRefs.current?.[activeTab];
    if (!el || !headRef.current) return;

    const targetTop = el.offsetTop;
    const targetHeight = el.offsetHeight;

    const pillRadius = 'var(--border-radius-md, 10px)';
    const chicletRadius = '8px';

    if (isFirstRender.current) {
      isFirstRender.current = false;
      [headRef.current, ...trailRefs.current].forEach((node) => {
        if (!node) return;
        node.style.top = `${targetTop}px`;
        node.style.height = `${targetHeight}px`;
        node.style.left = '0px';
        node.style.right = '0px';
        node.style.borderRadius = pillRadius;
        node.style.opacity = node === headRef.current ? '1' : '0';
      });
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

    // Keyframe trajectory for the primary head (Little Compact Rounded Rectangle during flight)
    const headKeyframes = [
      // 0%: Full resting pill at origin
      {
        top: `${prevTop}px`,
        height: `${targetHeight}px`,
        left: '0px',
        right: '0px',
        borderRadius: pillRadius,
        transform: 'scale(1, 1)',
        opacity: 1,
      },
      // 18%: Contracts into a little compact rounded rectangle
      {
        top: `${prevTop + (isMovingDown ? 8 : -8)}px`,
        height: '32px',
        left: 'calc(50% - 24px)',
        right: 'calc(50% - 24px)',
        borderRadius: chicletRadius,
        transform: 'scale(0.9, 1.15)',
        opacity: 1,
      },
      // 50%: Mid-flight peak velocity with little chiclet aerodynamic stretch
      {
        top: `${midTop}px`,
        height: '36px',
        left: 'calc(50% - 22px)',
        right: 'calc(50% - 22px)',
        borderRadius: chicletRadius,
        transform: isMovingDown ? 'scale(0.85, 1.45) translateY(4px)' : 'scale(0.85, 1.45) translateY(-4px)',
        opacity: 1,
      },
      // 82%: Approaching target & horizontal expansion
      {
        top: `${targetTop + (isMovingDown ? 2 : -2)}px`,
        height: `${targetHeight * 0.92}px`,
        left: '6px',
        right: '6px',
        borderRadius: pillRadius,
        transform: 'scale(1.02, 0.94)',
        opacity: 1,
      },
      // 100%: Relaxes into full destination pill
      {
        top: `${targetTop}px`,
        height: `${targetHeight}px`,
        left: '0px',
        right: '0px',
        borderRadius: pillRadius,
        transform: 'scale(1, 1)',
        opacity: 1,
      },
    ];

    const duration = Math.min(1000, Math.max(720, distance * 3.4));
    const easing = 'cubic-bezier(0.22, 1, 0.36, 1)';

    // Animate the main head
    const headAnim = headRef.current.animate(headKeyframes, {
      duration,
      easing,
      fill: 'forwards',
    });

    headAnim.onfinish = () => {
      if (headRef.current) {
        headRef.current.style.top = `${targetTop}px`;
        headRef.current.style.height = `${targetHeight}px`;
        headRef.current.style.left = '0px';
        headRef.current.style.right = '0px';
        headRef.current.style.borderRadius = pillRadius;
        headRef.current.style.transform = 'scale(1, 1)';
        headRef.current.style.opacity = '1';
      }
    };

    // Animate the 4 progressive temporal ghost copies (Compact Little Rounded Rectangles)
    trailRefs.current.forEach((trailNode, idx) => {
      if (!trailNode) return;
      const trailConfig = TRAILS[idx];
      const halfWidth = trailConfig.width / 2;

      const trailKeyframes = [
        // 0%: Hidden inside origin pill
        {
          top: `${prevTop}px`,
          height: `${targetHeight}px`,
          left: '0px',
          right: '0px',
          borderRadius: pillRadius,
          transform: 'scale(1, 1)',
          opacity: 0,
        },
        // 22%: Emanating little trailing ghost
        {
          top: `${prevTop + (isMovingDown ? 2 : -2)}px`,
          height: '28px',
          left: `calc(50% - ${halfWidth}px)`,
          right: `calc(50% - ${halfWidth}px)`,
          borderRadius: chicletRadius,
          transform: 'scale(0.85, 1.05)',
          opacity: trailConfig.opacity * 0.85,
        },
        // 52%: Trailing behind the head in full temporal smear
        {
          top: `${midTop - (isMovingDown ? (idx + 1) * 14 : -(idx + 1) * 14)}px`,
          height: '32px',
          left: `calc(50% - ${halfWidth}px)`,
          right: `calc(50% - ${halfWidth}px)`,
          borderRadius: chicletRadius,
          transform: isMovingDown
            ? 'scale(0.8, 1.35) translateY(2px)'
            : 'scale(0.8, 1.35) translateY(-2px)',
          opacity: trailConfig.opacity,
        },
        // 80%: Collapsing into impact zone
        {
          top: `${targetTop - (isMovingDown ? (idx + 1) * 8 : -(idx + 1) * 8)}px`,
          height: '28px',
          left: `calc(50% - ${halfWidth + 4}px)`,
          right: `calc(50% - ${halfWidth + 4}px)`,
          borderRadius: chicletRadius,
          transform: 'scale(0.9, 0.98)',
          opacity: trailConfig.opacity * 0.5,
        },
        // 100%: Absorbed seamlessly into target pill
        {
          top: `${targetTop}px`,
          height: `${targetHeight}px`,
          left: '0px',
          right: '0px',
          borderRadius: pillRadius,
          transform: 'scale(1, 1)',
          opacity: 0,
        },
      ];

      const trailAnim = trailNode.animate(trailKeyframes, {
        duration,
        easing,
        fill: 'forwards',
      });

      trailAnim.onfinish = () => {
        if (trailNode) {
          trailNode.style.top = `${targetTop}px`;
          trailNode.style.height = `${targetHeight}px`;
          trailNode.style.left = '0px';
          trailNode.style.right = '0px';
          trailNode.style.borderRadius = pillRadius;
          trailNode.style.transform = 'scale(1, 1)';
          trailNode.style.opacity = '0';
        }
      };
    });
  }, [activeTab, tabRefs]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      {/* 4 Directional Temporal Ghost Trails (Little Rounded Rectangles) */}
      {TRAILS.map((_, idx) => (
        <div
          key={idx}
          ref={(el) => (trailRefs.current[idx] = el)}
          className="sidebar-active-indicator"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            background: 'var(--sidebar-active-bg)',
            boxShadow: 'var(--sidebar-active-shadow)',
            borderRadius: 'var(--border-radius-md)',
            pointerEvents: 'none',
            opacity: 0,
            transformOrigin: 'center center',
            willChange: 'transform, top, left, right, opacity',
          }}
        />
      ))}

      {/* Primary Little Rounded Rectangle Head */}
      <div
        ref={headRef}
        className="sidebar-active-indicator"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          background: 'var(--sidebar-active-bg)',
          boxShadow: 'var(--sidebar-active-shadow)',
          borderRadius: 'var(--border-radius-md)',
          pointerEvents: 'none',
          opacity: 0,
          transformOrigin: 'center center',
          willChange: 'transform, top, left, right',
        }}
      />
    </div>
  );
};
