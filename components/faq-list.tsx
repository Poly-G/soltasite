'use client';

import { useEffect, useRef } from 'react';
import { faqs } from '@/lib/faqs';

export function FaqList() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 861px)');
    const sync = () => root.current?.querySelectorAll('details').forEach((element) => { element.open = media.matches; });
    sync(); media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  return <div className="faqs" ref={root}>{faqs.map(([title, text]) => <details className="faq" key={title}><summary>{title}<span className="pl" aria-hidden="true">+</span></summary><div className="p">{text}</div></details>)}</div>;
}
