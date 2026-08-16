import React, { useEffect, useRef } from 'react';

export const LiquidSidebarIndicator = ({ activeTab, tabRefs }) => {
  const containerRef = useRef(null);
  const headRef = useRef(null);
  const trailRefs = useRef([]);
  const prevTabRef = useRef(activeTab);
  const isFirstRender = useRef(true);

  // 4 progressive temporal ghost layers for authentic motion blur sampling
  const TRAILS = [
    { delay: 25, opacity: 0.30, scaleX: 0.88 },
    { delay: 55, opacity: 0.20, scaleX: 0.76 },
    { delay: 90, opacity: 0.12, scaleX: 0.64 },
    { delay: 130, opacity: 0.05, scaleX: 0.52 },
  ];

  useEffect(() => {
    const el = tabRefs.current?.[activeTab];
    if (!el || !headRef.current) return;

    const targetTop = el.offsetTop;
    const targetHeight = el.offsetHeight;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      [headRef.current, ...trailRefs.current].forEach((node) => {
        if (!node) return;
        node.style.top = `${targetTop}px`;
        node.style.height = `${targetHeight}px`;
        node.style.left = '0px';
        node.style.right = '0px';
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

    // Organic teardrop contour depending on travel vector
    const teardropRadius = isMovingDown
      ? '30% 30% 70% 70% / 20% 20% 80% 80%'
      : '70% 70% 30% 30% / 80% 80% 20% 20%';

    const pillRadius = 'var(--border-radius-md, 10px)';

    // Keyframe trajectory for the primary head droplet
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
      // 18%: Pinches into liquid droplet
      {
        top: `${prevTop + (isMovingDown ? 8 : -8)}px`,
        height: '32px',
        left: 'calc(50% - 16px)',
        right: 'calc(50% - 16px)',
        borderRadius: '50%',
        transform: 'scale(0.85, 1.25)',
        opacity: 1,
      },
      // 50%: Mid-flight peak velocity with aerodynamic stretch
      {
        top: `${midTop}px`,
        height: '42px',
        left: 'calc(50% - 14px)',
        right: 'calc(50% - 14px)',
        borderRadius: teardropRadius,
        transform: isMovingDown ? 'scale(0.7, 1.65) translateY(6px)' : 'scale(0.7, 1.65) translateY(-6px)',
        opacity: 1,
      },
      // 82%: Impact splash on target tab
      {
        top: `${targetTop + (isMovingDown ? 2 : -2)}px`,
        height: `${targetHeight * 0.92}px`,
        left: '3px',
        right: '3px',
        borderRadius: '14px',
        transform: 'scale(1.04, 0.92)',
        opacity: 1,
      },
      // 100%: Relaxes into destination pill
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

    const duration = Math.min(1100, Math.max(800, distance * 3.8));
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

    // Animate the 4 progressive temporal ghost copies (Directional Temporal Motion Blur)
    trailRefs.current.forEach((trailNode, idx) => {
      if (!trailNode) return;
      const trailConfig = TRAILS[idx];

      // Temporal copy trajectory with positional lag behind the head
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
        // 22%: Emanates out of the contracting pill as a trailing ghost
        {
          top: `${prevTop + (isMovingDown ? 2 : -2)}px`,
          height: '28px',
          left: 'calc(50% - 14px)',
          right: 'calc(50% - 14px)',
          borderRadius: '50%',
          transform: `scale(${0.8 * trailConfig.scaleX}, 1.1)`,
          opacity: trailConfig.opacity * 0.8,
        },
        // 52%: Trailing behind the head in full temporal smear
        {
          top: `${midTop - (isMovingDown ? (idx + 1) * 14 : -(idx + 1) * 14)}px`,
          height: '36px',
          left: 'calc(50% - 13px)',
          right: 'calc(50% - 13px)',
          borderRadius: teardropRadius,
          transform: isMovingDown
            ? `scale(${0.65 * trailConfig.scaleX}, 1.5) translateY(2px)`
            : `scale(${0.65 * trailConfig.scaleX}, 1.5) translateY(-2px)`,
          opacity: trailConfig.opacity,
        },
        // 80%: Collapsing into the impact zone behind the head
        {
          top: `${targetTop - (isMovingDown ? (idx + 1) * 8 : -(idx + 1) * 8)}px`,
          height: '30px',
          left: 'calc(50% - 15px)',
          right: 'calc(50% - 15px)',
          borderRadius: '50%',
          transform: `scale(${0.9 * trailConfig.scaleX}, 1.0)`,
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
      {/* 4 Directional Temporal Ghost Trails */}
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
            willChange: 'transform, top, left, right, border-radius, opacity',
          }}
        />
      ))}

      {/* Primary Liquid Droplet Head */}
      <div
        ref={headRef}
        className="sidebar-active-indicator liquid-head"
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
          willChange: 'transform, top, left, right, border-radius',
        }}
      />
    </div>
  );
};
