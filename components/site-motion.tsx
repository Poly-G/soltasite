'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function SiteMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.solta-site .rv');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('in'); observer.unobserve(entry.target);
      }
    }, { threshold: 0.15 });
    // Content starts visible for no-JS/reduced-motion access. Animate only below-fold blocks.
    for (const element of elements) if (element.getBoundingClientRect().top > window.innerHeight) {
      element.classList.add('will-reveal'); observer.observe(element);
    }
    const onMotion = () => {
      if (reduce.matches) { for (const element of elements) element.classList.add('in'); observer.disconnect(); }
    };
    reduce.addEventListener('change', onMotion);
    return () => { observer.disconnect(); reduce.removeEventListener('change', onMotion); };
  }, [pathname]);
  return null;
}
