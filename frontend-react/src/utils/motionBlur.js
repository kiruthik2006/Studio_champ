/**
 * Temporal Motion Blur Engine
 * 
 * Reusable motion blur framework based on multi-copy temporal sampling.
 * Generates directional temporal ghost trails along velocity vectors for any element,
 * CSS animation, or Web Animation API sequence.
 */

/**
 * Executes a Web Animation with authentic directional temporal ghost trails.
 *
 * @param {HTMLElement} element - The target DOM element to animate.
 * @param {Array<Keyframe>} keyframes - Web Animation API keyframes.
 * @param {Object} options - Configuration options.
 * @param {number} [options.copies=4] - Number of ghost trailing copies.
 * @param {Array<number>} [options.opacities=[0.32, 0.20, 0.12, 0.05]] - Progressive trail opacities.
 * @param {number} [options.duration=800] - Animation duration in ms.
 * @param {string} [options.easing='cubic-bezier(0.22, 1, 0.36, 1)'] - Easing curve.
 * @param {Function} [options.onFinish] - Callback when animation and cleanup finishes.
 * @returns {{ mainAnimation: Animation, cancel: Function }}
 */
export const animateWithMotionBlur = (element, keyframes, options = {}) => {
  if (!element || !element.parentElement) return null;

  const {
    copies = 4,
    opacities = [0.32, 0.20, 0.12, 0.05],
    duration = 800,
    easing = 'cubic-bezier(0.22, 1, 0.36, 1)',
    onFinish,
  } = options;

  const parent = element.parentElement;
  const parentPos = window.getComputedStyle(parent).position;
  if (parentPos === 'static') {
    parent.style.position = 'relative';
  }

  // Create progressive ghost clone layers
  const ghosts = [];
  for (let i = 0; i < copies; i++) {
    const ghost = element.cloneNode(true);
    ghost.removeAttribute('id');
    ghost.setAttribute('aria-hidden', 'true');
    ghost.classList.add('temporal-motion-ghost');
    ghost.style.position = 'absolute';
    ghost.style.pointerEvents = 'none';
    ghost.style.zIndex = Math.max(0, (parseInt(element.style.zIndex || '1', 10) - 1));
    ghost.style.opacity = '0';
    ghost.style.willChange = 'transform, top, left, opacity';
    parent.insertBefore(ghost, element);
    ghosts.push({ node: ghost, opacity: opacities[i] ?? (0.3 / (i + 1)) });
  }

  // Run main element animation
  const mainAnimation = element.animate(keyframes, {
    duration,
    easing,
    fill: 'forwards',
  });

  // Calculate and animate temporal ghost copies with progressive delays
  const ghostAnimations = ghosts.map((ghost, idx) => {
    const ghostKeyframes = keyframes.map((frame, fIdx) => {
      const isStart = fIdx === 0;
      const isEnd = fIdx === keyframes.length - 1;
      return {
        ...frame,
        opacity: isStart || isEnd ? 0 : ghost.opacity,
      };
    });

    const lagDuration = duration + (idx + 1) * 25;

    return ghost.node.animate(ghostKeyframes, {
      duration: lagDuration,
      easing,
      fill: 'forwards',
    });
  });

  mainAnimation.onfinish = () => {
    setTimeout(() => {
      ghosts.forEach(({ node }) => node.remove());
      if (onFinish) onFinish();
    }, 60);
  };

  return {
    mainAnimation,
    ghostAnimations,
    cancel: () => {
      try {
        mainAnimation.cancel();
        ghostAnimations.forEach((a) => a.cancel());
      } catch {}
      ghosts.forEach(({ node }) => node.remove());
    },
  };
};

/**
 * Initializes declarative [data-motion-blur] attributes across the DOM.
 * When elements with [data-motion-blur] move or trigger classes, temporal ghost trails are spawned.
 */
export const initDeclarativeMotionBlur = () => {
  if (typeof window === 'undefined') return;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-motion-active') {
        const target = mutation.target;
        if (target.getAttribute('data-motion-active') === 'true') {
          const copies = parseInt(target.getAttribute('data-motion-copies') || '4', 10);
          // Auto-spawn ghost trail copies
          const ghosts = [];
          const parent = target.parentElement;
          if (parent) {
            for (let i = 0; i < copies; i++) {
              const ghost = target.cloneNode(true);
              ghost.removeAttribute('data-motion-active');
              ghost.classList.add('temporal-ghost-copy', `ghost-trail-${i + 1}`);
              ghost.style.pointerEvents = 'none';
              parent.insertBefore(ghost, target);
              ghosts.push(ghost);
            }
          }
        }
      }
    });
  });

  observer.observe(document.body, {
    attributes: true,
    subtree: true,
    attributeFilter: ['data-motion-active'],
  });

  return () => observer.disconnect();
};
