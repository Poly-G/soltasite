'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import styles from './keshia.module.css';

const email = 'Keshia.jean@outlook.com';
const reelId = 'v3sclIoVG-I';
const actorsAccess = 'https://resumes.actorsaccess.com/2667065-7257274';
const profiles = {
  imdb: 'https://www.imdb.com/name/nm18590848/',
  actorsAccess,
  instagram: 'https://www.instagram.com/keshiajean_x/',
} as const;

const repMail = `mailto:${email}?subject=${encodeURIComponent('Representation inquiry, Keshia Sophia Jean')}`;
const castingMail = `mailto:${email}?subject=${encodeURIComponent('Casting inquiry, Keshia Sophia Jean')}`;

const photos = [
  { src: '/assets/img/keshia-sophia-jean/headshot-1-theatrical.jpg', width: 1023, height: 1537, alt: 'Keshia Sophia Jean, theatrical headshot', label: 'Theatrical' },
  { src: '/assets/img/keshia-sophia-jean/headshot-2-glasses.jpg', width: 1024, height: 1535, alt: 'Keshia Sophia Jean in round glasses', label: 'Glasses' },
  { src: '/assets/img/keshia-sophia-jean/headshot-3-black-and-white.jpg', width: 1284, height: 1917, alt: 'Keshia Sophia Jean, black and white headshot', label: 'Black and white' },
  { src: '/assets/img/keshia-sophia-jean/headshot-4-dramatic.jpg', width: 1284, height: 1905, alt: 'Keshia Sophia Jean, dramatic headshot', label: 'Dramatic' },
] as const;

function cx(...names: Array<string | false | null | undefined>) {
  return names.filter(Boolean).map((name) => styles[name as keyof typeof styles] ?? name).join(' ');
}

export function KeshiaExampleClient({ className }: { className: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [cutting, setCutting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const pageRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.dataset.motion = calm ? 'off' : 'on';
    const previous = document.documentElement.style.scrollBehavior;
    if (!calm) document.documentElement.style.scrollBehavior = 'smooth';

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);

    const revealables = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (calm || !('IntersectionObserver' in window)) {
      revealables.forEach((el) => { el.dataset.in = 'true'; });
      return () => {
        document.removeEventListener('keydown', onKeyDown);
        document.documentElement.style.scrollBehavior = previous;
      };
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).dataset.in = 'true';
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    revealables.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      document.removeEventListener('keydown', onKeyDown);
      document.documentElement.style.scrollBehavior = previous;
    };
  }, []);

  function playReel() {
    if (playing || cutting) return;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (calm) {
      setPlaying(true);
      return;
    }
    setCutting(true);
    window.setTimeout(() => {
      setPlaying(true);
      requestAnimationFrame(() => setCutting(false));
    }, 360);
  }

  function watchFromHero() {
    reelRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    window.setTimeout(playReel, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 500);
  }

  function onStripScroll() {
    const strip = stripRef.current;
    if (!strip) return;
    const frames = Array.from(strip.querySelectorAll<HTMLElement>('[data-photo-frame]'));
    if (frames.length < 2) return;
    const step = frames[1].offsetLeft - frames[0].offsetLeft || 1;
    setPhotoIndex(Math.min(frames.length - 1, Math.round(strip.scrollLeft / step)));
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  const year = new Date().getFullYear();

  return (
    <div ref={pageRef} className={className}>
      <a className={cx('skip')} href="#keshia-main">Skip to content</a>

      <header className={cx('site-header')}>
        <div className={cx('container', 'header-row')}>
          <a className={cx('brand', 'poster')} href="#top">Keshia Sophia Jean</a>
          <nav className={cx('site-nav', menuOpen && 'is-open')} id="keshia-site-nav" aria-label="Keshia Sophia Jean navigation">
            <a className={cx('poster')} href="#reel" onClick={() => setMenuOpen(false)}>Reel</a>
            <a className={cx('poster')} href="#photos" onClick={() => setMenuOpen(false)}>Photos</a>
            <a className={cx('poster')} href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <a className={cx('poster')} href="#resume" onClick={() => setMenuOpen(false)}>Resume</a>
            <a className={cx('poster', 'nav-contact-phone')} href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </nav>
          <a className={cx('poster', 'outline', 'header-contact')} href="#contact">Contact</a>
          <button className={cx('poster', 'menu-toggle')} type="button" aria-expanded={menuOpen} aria-controls="keshia-site-nav" onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      <main id="keshia-main" tabIndex={-1}>
        <section className={cx('hero')} id="top">
          <div className={cx('hero-photo')}>
            <Image src="/assets/img/keshia-sophia-jean/hero.jpg" width={1284} height={1923} sizes="(max-width: 820px) 100vw, 64vw" alt="Keshia Sophia Jean, smiling, in glasses and a denim jacket" preload className={cx('hero-image')} />
          </div>
          <div className={cx('hero-shade')} aria-hidden="true" />
          <div className={cx('container', 'hero-copy')}>
            <p className={cx('kicker')}>Actor · Independent film</p>
            <h1 className={cx('name')}>Keshia<br />Sophia<br />Jean</h1>
            <p className={cx('hero-place')}>Los Angeles and Las Vegas <span className={cx('sep')}>·</span> <span className={cx('travel')}>Available to travel</span></p>
            <div className={cx('hero-actions')}>
              <button className={cx('btn')} type="button" onClick={watchFromHero}><span className={cx('tri')} aria-hidden="true">▶</span> Watch the reel</button>
              <a className={cx('tlink', 'hide-phone')} href={repMail}>Request a meeting</a>
            </div>
          </div>
        </section>

        <section className={cx('intro')} id="details" aria-label="Introduction">
          <div className={cx('container')}>
            <p className={cx('lede')}>Keshia Sophia Jean is an actor available for projects in Los Angeles and Las Vegas, with short film and theatre credits. Her focus is independent and arthouse film.</p>
            <p className={cx('intro-ask')}>Seeking film and TV representation. <a className={cx('tlink')} href={repMail}>Request a meeting</a></p>
          </div>
        </section>

        <section className={cx('reel')} id="reel" aria-labelledby="keshia-reel-title">
          <div ref={reelRef} className={cx('reel-stage', playing && 'is-playing', cutting && 'is-cut')} data-reveal>
            {playing ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${reelId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title="Keshia Sophia Jean, demo reel"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
              />
            ) : (
              <>
                <Image className={cx('reel-poster')} src="/assets/img/keshia-sophia-jean/reel-poster.jpg" width={1584} height={744} sizes="100vw" alt="Demo reel still featuring Keshia Sophia Jean" />
                <div className={cx('reel-shade')} aria-hidden="true" />
                <button className={cx('reel-play')} type="button" aria-label="Play the demo reel" onClick={playReel}><span aria-hidden="true">▶</span></button>
                <div className={cx('reel-label', 'poster')} aria-hidden="true">Demo reel</div>
              </>
            )}
          </div>
          <p className={cx('visually-hidden')} role="status">{playing ? 'Playing the demo reel.' : ''}</p>
          <div className={cx('container', 'reel-links')}>
            <h2 className={cx('poster', 'reel-title')} id="keshia-reel-title">Demo reel</h2>
            <a className={cx('tlink')} href={`https://youtu.be/${reelId}`} target="_blank" rel="noopener noreferrer">Watch on YouTube</a>
            <div className={cx('reel-more', 'hide-phone')}>
              <a className={cx('tlink')} href={repMail}>Representation</a>
              <a className={cx('tlink')} href={castingMail}>Casting</a>
              <a className={cx('tlink')} href={actorsAccess} target="_blank" rel="noopener noreferrer">Resume</a>
            </div>
          </div>
        </section>

        <section className={cx('photos')} id="photos" aria-labelledby="keshia-photos-title">
          <div className={cx('container')}><h2 className={cx('label')} id="keshia-photos-title">Photos</h2></div>
          <div ref={stripRef} className={cx('strip')} tabIndex={0} aria-label="Headshots, scroll sideways for more" onScroll={onStripScroll}>
            {photos.map((photo, index) => (
              <figure className={cx('frame')} data-reveal data-photo-frame key={photo.src}>
                <div className={cx('frame-bar')}><span className={cx('mark')}>KSJ</span><span className={cx('mark', 'mark-num')}>{String(index + 1).padStart(2, '0')}</span></div>
                <div className={cx('frame-photo')}>
                  <Image src={photo.src} width={photo.width} height={photo.height} sizes="(max-width: 820px) 78vw, 25vw" alt={photo.alt} />
                </div>
                <figcaption className={cx('frame-bar')}><span className={cx('mark', 'mark-num')}>{photo.label}</span></figcaption>
              </figure>
            ))}
          </div>
          <div className={cx('container', 'photos-foot')}>
            <p className={cx('small')}><span className={cx('hide-phone')}>Headshots, 2026</span><span className={cx('show-phone')} aria-live="polite">{photoIndex + 1} of {photos.length}{photoIndex === photos.length - 1 ? '' : ' · swipe for more'}</span></p>
            <a className={cx('tlink')} href="/assets/files/keshia-sophia-jean-headshots.zip" download>Download headshots</a>
          </div>
        </section>

        <section className={cx('about')} id="about" aria-labelledby="keshia-about-title" data-reveal>
          <div className={cx('about-photo')}>
            <Image src="/assets/img/keshia-sophia-jean/about-theater-seats.jpg" width={1500} height={2000} sizes="100vw" alt="Keshia Sophia Jean sitting in the red seats of an empty theater" />
            <div className={cx('about-shade')} aria-hidden="true" />
          </div>
          <div className={cx('about-head')}>
            <h2 className={cx('label')} id="keshia-about-title">About</h2>
            <p className={cx('about-line')}>Independent film. Complex characters.</p>
          </div>
          <div className={cx('about-body')}>
            <p>Keshia Sophia Jean is an actor drawn to intimate stories, complicated people, and the things left unsaid. Her work spans independent short films, with a particular interest in psychological drama and arthouse cinema.</p>
            <p>She studies human behavior, bringing curiosity about people’s contradictions to her work.</p>
          </div>
        </section>

        <section className={cx('resume')} id="resume" aria-labelledby="keshia-resume-title" data-reveal>
          <div className={cx('container')}>
            <div className={cx('resume-head')}>
              <h2 className={cx('label')} id="keshia-resume-title">Resume</h2>
              <p className={cx('small')}><span className={cx('hide-phone')}>5′4″, black hair, brown eyes. Non-union. Los Angeles and Las Vegas.</span> <a className={cx('tlink')} href={actorsAccess} target="_blank" rel="noopener noreferrer">Full resume</a></p>
            </div>

            <CreditRow index={0} title="Film" entries={[
              ['Maya', <><i key="release">Release</i>, drama short, 2026</>],
              ['Maya', <><i key="channel">The Channel Side</i>, sci-fi short, 2026</>],
              ['Maya', <>Easterseals Disability Film Challenge, short, 2026</>],
              ['Emma', <><i key="printer">The Printer</i>, comedy short, 2026</>],
            ]} />
            <CreditRow index={1} title="Theatre" entries={[
              ['Calpurnia', <><i key="mockingbird">To Kill a Mockingbird</i><span className={cx('venue')}>, Sioux Empire Community Theatre</span></>],
              ['Lily', <><i key="college">13 Ways to Screw Up a College Interview</i>, Sioux Empire Community Theatre</>],
              ['Ensemble', <><i key="carol">A Christmas Carol</i>, Incirlik Air Base theatre community, Turkey</>],
            ]} />
            <CreditRow index={2} title="Training" phoneLast entries={[
              ['Meisner technique', <>Summit Conservatory of the Arts, Las Vegas</>],
              ['On-camera technique', <>Summit Conservatory of the Arts</>],
              ['On-camera scene study', <>Summit Conservatory of the Arts</>],
              ['Improv', <>Summit Conservatory of the Arts; Mom’s Basement Theater</>],
            ]} />
            <div className={cx('cred', 'cred-last')} style={{ '--i': 3 } as CSSProperties}>
              <h3 className={cx('cred-k')}>Skills</h3>
              <div className={cx('cred-e', 'cred-text')}>Standard American and Southern American dialects. U.S. Air Force veteran (8 years): combat and weapons training. Basketball. Self-tape production. Valid passport.</div>
            </div>
          </div>
        </section>

        <div className={cx('curtain')}>
          <Image src="/assets/img/keshia-sophia-jean/curtain.jpg" width={1125} height={2000} sizes="100vw" alt="Keshia Sophia Jean in silhouette in front of theater curtains" />
        </div>

        <section className={cx('contact')} id="contact" aria-labelledby="keshia-contact-title">
          <div className={cx('contact-inner')}>
            <h2 className={cx('label')} id="keshia-contact-title">Contact</h2>
            <p className={cx('contact-line')}>Open to representation.</p>
            <p className={cx('contact-sub')}>Keshia is taking meetings with agents and managers in Los Angeles and Las Vegas.</p>
            <a className={cx('btn')} href={repMail}>Request a meeting</a>
            <p className={cx('small', 'contact-casting')}>Casting and filmmakers: <a className={cx('tlink')} href={castingMail}>casting inquiry</a>.<span className={cx('hide-phone')}> Local hire in both cities.</span></p>
            <p className={cx('contact-email')}><span>{email}</span> <button className={cx('copy', 'poster')} type="button" onClick={copyEmail}>{copied ? 'Copied' : 'Copy'}</button></p>
            <p className={cx('small', 'copy-status')} role="status">{copied ? `Copied ${email}` : ''}</p>
            <ul className={cx('profiles')}>
              <li><a className={cx('poster')} href={profiles.imdb} target="_blank" rel="noopener noreferrer">IMDb</a></li>
              <li><a className={cx('poster')} href={profiles.actorsAccess} target="_blank" rel="noopener noreferrer">Actors Access</a></li>
              <li><a className={cx('poster')} href={profiles.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
            </ul>
          </div>
        </section>
      </main>

      <footer className={cx('billing')}>
        <p className={cx('hide-phone')}>Actor · Independent film</p>
        <p className={cx('billing-name')}>Keshia Sophia Jean</p>
        <p className={cx('hide-phone')}>Los Angeles &nbsp; Las Vegas &nbsp; Available to travel</p>
        <p className={cx('hide-phone', 'billing-links')}><a href="#reel">Reel</a> &nbsp; <a href="#photos">Photos</a> &nbsp; <a href="#resume">Resume</a> &nbsp; <a href={profiles.imdb} target="_blank" rel="noopener noreferrer">IMDb</a> &nbsp; <a href={profiles.actorsAccess} target="_blank" rel="noopener noreferrer">Actors Access</a> &nbsp; <a href={profiles.instagram} target="_blank" rel="noopener noreferrer">Instagram</a> &nbsp; © {year}</p>
        <p className={cx('show-phone')}>Actor · Independent film &nbsp; Los Angeles &nbsp; Las Vegas &nbsp; © {year}</p>
      </footer>
    </div>
  );
}

function CreditRow({ index, title, entries, phoneLast = false }: { index: number; title: string; entries: Array<[string, ReactNode]>; phoneLast?: boolean }) {
  return (
    <div className={cx('cred', phoneLast && 'cred-phone-last')} style={{ '--i': index } as CSSProperties}>
      <h3 className={cx('cred-k')}>{title}</h3>
      <div className={cx('cred-e')}>
        {entries.flatMap(([role, work], entryIndex) => [
          <span className={cx('role')} key={`${role}-${entryIndex}-role`}>{role}</span>,
          <span key={`${role}-${entryIndex}-work`}>{work}</span>,
        ])}
      </div>
    </div>
  );
}