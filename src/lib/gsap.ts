'use client';

import { useEffect, useRef, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Check reduced motion preference
const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

interface ScrollRevealOptions {
  y?: number;
  x?: number;
  scale?: number;
  opacity?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  once?: boolean;
  stagger?: number;
}

/**
 * Hook to animate elements when they scroll into view.
 */
export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !ref.current) return;

    const el = ref.current;
    const {
      y = 40,
      x = 0,
      scale = 1,
      opacity = 0,
      duration = 0.9,
      delay = 0,
      ease = 'power3.out',
      start = 'top 85%',
      once = true,
    } = options;

    gsap.set(el, { y, x, scale, opacity });

    const animation = gsap.to(el, {
      y: 0,
      x: 0,
      scale: 1,
      opacity: 1,
      duration,
      delay,
      ease,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: once ? 'play none none none' : 'play reverse play reverse',
      },
    });

    triggerRef.current = animation.scrollTrigger as ScrollTrigger;

    return () => {
      if (triggerRef.current) {
        triggerRef.current.kill();
      }
      animation.kill();
    };
  }, [options]);

  return ref;
}

/**
 * Hook to animate a container's children with stagger when scrolled into view.
 */
export function useStaggerReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !ref.current) return;

    const container = ref.current;
    const children = container.children;
    if (!children.length) return;

    const {
      y = 40,
      x = 0,
      scale = 1,
      opacity = 0,
      duration = 0.8,
      ease = 'power3.out',
      start = 'top 85%',
      stagger = 0.1,
      once = true,
    } = options;

    gsap.set(children, { y, x, scale, opacity });

    const animation = gsap.to(children, {
      y: 0,
      x: 0,
      scale: 1,
      opacity: 1,
      duration,
      ease,
      stagger,
      scrollTrigger: {
        trigger: container,
        start,
        toggleActions: once ? 'play none none none' : 'play reverse play reverse',
      },
    });

    triggerRef.current = animation.scrollTrigger as ScrollTrigger;

    return () => {
      if (triggerRef.current) {
        triggerRef.current.kill();
      }
      animation.kill();
    };
  }, [options]);

  return ref;
}

/**
 * Hook to create a parallax effect on an element.
 */
export function useParallax<T extends HTMLElement>(
  speed: number = 0.2
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !ref.current) return;

    const el = ref.current;
    const yMove = speed * 100;

    const animation = gsap.fromTo(
      el,
      { y: -yMove },
      {
        y: yMove,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );

    triggerRef.current = animation.scrollTrigger as ScrollTrigger;

    return () => {
      if (triggerRef.current) {
        triggerRef.current.kill();
      }
      animation.kill();
    };
  }, [speed]);

  return ref;
}

/**
 * Hook to animate a number counter.
 */
export function useCounter(
  end: number,
  duration: number = 2,
  delay: number = 0
): RefObject<HTMLSpanElement | null> {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) {
      if (ref.current) ref.current.textContent = String(end);
      return;
    }

    const el = ref.current;
    const obj = { value: 0 };

    const animation = gsap.to(obj, {
      value: end,
      duration,
      delay,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = Math.floor(obj.value).toString();
      },
    });

    return () => {
      animation.kill();
    };
  }, [end, duration, delay]);

  return ref;
}

/**
 * Hook to run a one-time entrance animation on mount.
 */
export function useEntrance<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !ref.current) return;

    const el = ref.current;
    const {
      y = 30,
      x = 0,
      scale = 1,
      opacity = 0,
      duration = 0.8,
      delay = 0,
      ease = 'power3.out',
      stagger = 0,
    } = options;

    const targets = stagger && el.children.length ? el.children : el;

    gsap.set(targets, { y, x, scale, opacity });

    const animation = gsap.to(targets, {
      y: 0,
      x: 0,
      scale: 1,
      opacity: 1,
      duration,
      delay,
      ease,
      stagger: stagger || 0,
    });

    return () => {
      animation.kill();
    };
  }, [options]);

  return ref;
}

/**
 * Refresh ScrollTrigger on dynamic content changes.
 */
export function refreshScrollTrigger(): void {
  if (typeof window !== 'undefined') {
    ScrollTrigger.refresh();
  }
}

export { gsap, ScrollTrigger };
