import React, { useEffect, useRef } from 'react';

export const LiquidSidebarIndicator = ({ activeTab, tabRefs }) => {
  const containerRef = useRef(null);
  const headRef = useRef(null);
  const trailRefs = useRef([]);
  const prevTabRef = useRef(activeTab);
  const isFirstRender = useRef(true);

  // 4 progressive temporal ghost layers for authentic motion blur sampling
  const TRAILS = [
    { opacity: 0.32, insetX: 4 },
    { opacity: 0.20, insetX: 8 },
    { opacity: 0.12, insetX: 12 },
    { opacity: 0.05, insetX: 16 },
  ];

  useEffect(() => {
    const el = tabRefs.current?.[activeTab];
    if (!el || !headRef.current) return;

    const targetTop = el.offsetTop;
    const targetHeight = el.offsetHeight;

    const pillRadius = 'var(--border-radius-md, 10px)';

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

    // Keyframe trajectory for the primary head (Rounded-Corner Rectangle throughout)
    const headKeyframes = [
      // 0%: Full resting rounded rectangle at origin
      {
        top: `${prevTop}px`,
        height: `${targetHeight}px`,
        left: '0px',
        right: '0px',
        borderRadius: pillRadius,
        transform: 'scale(1, 1)',
        opacity: 1,
      },
      // 18%: Contracts horizontally into a sleek rounded rectangle
      {
        top: `${prevTop + (isMovingDown ? 8 : -8)}px`,
        height: `${targetHeight * 0.9}px`,
        left: '12px',
        right: '12px',
        borderRadius: pillRadius,
        transform: 'scale(1, 1.15)',
        opacity: 1,
      },
      // 50%: Mid-flight peak velocity with aerodynamic stretch along movement vector
      {
        top: `${midTop}px`,
        height: `${targetHeight * 0.95}px`,
        left: '18px',
        right: '18px',
        borderRadius: pillRadius,
        transform: isMovingDown ? 'scale(1, 1.45) translateY(4px)' : 'scale(1, 1.45) translateY(-4px)',
        opacity: 1,
      },
      // 82%: Impact & horizontal expansion on target tab
      {
        top: `${targetTop + (isMovingDown ? 2 : -2)}px`,
        height: `${targetHeight * 0.94}px`,
        left: '4px',
        right: '4px',
        borderRadius: pillRadius,
        transform: 'scale(1.02, 0.95)',
        opacity: 1,
      },
      // 100%: Relaxes into full rounded rectangle at destination
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

    const duration = Math.min(1050, Math.max(750, distance * 3.6));
    const easing = 'cubic-bezier(0.22, 1, 0.36, 1)';

    // Animate the main rounded rectangle head
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

    // Animate the 4 progressive temporal ghost copies (Rounded-Corner Rectangle trails)
    trailRefs.current.forEach((trailNode, idx) => {
      if (!trailNode) return;
      const trailConfig = TRAILS[idx];

      const trailKeyframes = [
        // 0%: Hidden inside origin rounded rectangle
        {
          top: `${prevTop}px`,
          height: `${targetHeight}px`,
          left: '0px',
          right: '0px',
          borderRadius: pillRadius,
          transform: 'scale(1, 1)',
          opacity: 0,
        },
        // 22%: Emanating trailing rounded rectangle ghost
        {
          top: `${prevTop + (isMovingDown ? 2 : -2)}px`,
          height: `${targetHeight * 0.85}px`,
          left: `${14 + trailConfig.insetX}px`,
          right: `${14 + trailConfig.insetX}px`,
          borderRadius: pillRadius,
          transform: 'scale(1, 1.05)',
          opacity: trailConfig.opacity * 0.85,
        },
        // 52%: Trailing behind the head in full temporal smear
        {
          top: `${midTop - (isMovingDown ? (idx + 1) * 14 : -(idx + 1) * 14)}px`,
          height: `${targetHeight * 0.88}px`,
          left: `${18 + trailConfig.insetX}px`,
          right: `${18 + trailConfig.insetX}px`,
          borderRadius: pillRadius,
          transform: isMovingDown
            ? 'scale(1, 1.35) translateY(2px)'
            : 'scale(1, 1.35) translateY(-2px)',
          opacity: trailConfig.opacity,
        },
        // 80%: Collapsing into target impact zone
        {
          top: `${targetTop - (isMovingDown ? (idx + 1) * 8 : -(idx + 1) * 8)}px`,
          height: `${targetHeight * 0.9}px`,
          left: `${10 + trailConfig.insetX}px`,
          right: `${10 + trailConfig.insetX}px`,
          borderRadius: pillRadius,
          transform: 'scale(1, 0.98)',
          opacity: trailConfig.opacity * 0.5,
        },
        // 100%: Absorbed seamlessly into target rounded rectangle
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
      {/* 4 Directional Temporal Ghost Trails (Rounded Rectangles) */}
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

      {/* Primary Rounded Rectangle Head */}
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
