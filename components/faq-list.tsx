'use client';

import { useEffect, useRef } from 'react';

const questions = [
  ["What's included?", 'A one-page site (up to four pages if you need them), up to 12 photos, IMDb and Actors Access linked, two rounds of changes.'],
  ['Do I own it?', 'Yes. The domain and the site are in your name. Already have a domain? We connect it.'],
  ['No reel yet?', 'The site goes live without it. Send it when it exists; we add it, no charge.'],
  ['My headshots are old.', 'Launch with your best current one. Swapping in new ones is one of your two updates.'],
  ['Monthly fee?', 'No. Hosting is included. Your domain renews at about $15 a year.'],
  ["What if I don’t like it?", "Two rounds of changes. If it's still not right, we refund you."],
  ['New headshots next year?', 'Send them. Two updates a year are included, then $29 each.'],
  ['No agent yet?', 'Your site has a contact form for agents. When you sign, we swap in your rep, free.'],
  ['For my kid?', "Yes. We put a parent's email on the page and leave off the school, the neighborhood and the exact age."],
] as const;

export function FaqList() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 861px)');
    const sync = () => root.current?.querySelectorAll('details').forEach((element) => { element.open = media.matches; });
    sync(); media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  return <div className="faqs" ref={root}>{questions.map(([title, text]) => <details className="faq" key={title}><summary>{title}<span className="pl" aria-hidden="true">+</span></summary><div className="p">{text}</div></details>)}</div>;
}
