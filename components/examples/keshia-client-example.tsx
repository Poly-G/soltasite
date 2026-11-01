'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from './keshia-client-example.module.css';

type KeshiaClientExampleProps = {
  compact?: boolean;
};

export function KeshiaClientExample({ compact = false }: KeshiaClientExampleProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'desktop' | 'phone'>('desktop');
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      openerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <div className={`${styles.preview} ${compact ? styles.compact : ''}`}>
        <div className={styles.desktopFrame}>
          <Image
            src="/assets/img/keshia-sophia-jean-desktop-hero.jpg"
            alt="Keshia Sophia Jean's actor website on desktop: her name in a handwritten script beside a smiling headshot."
            width={2048}
            height={1280}
            sizes={compact ? '(max-width: 860px) 260px, 330px' : '(max-width: 860px) 78vw, 640px'}
            className={styles.desktopImage}
          />
        </div>
        <div className={styles.phoneFrame}>
          <Image
            src="/assets/img/keshia-sophia-jean-phone-hero.jpg"
            alt="The same site on a phone, with her headshot above her name."
            width={780}
            height={1800}
            sizes={compact ? '100px' : '(max-width: 860px) 30vw, 190px'}
            className={styles.phoneImage}
          />
        </div>
        <button
          ref={openerRef}
          type="button"
          className={styles.previewButton}
          onClick={() => { setView('desktop'); setOpen(true); }}
        >
          View full page <span aria-hidden="true">↗</span>
        </button>
      </div>

      {open ? (
        <div className={styles.backdrop} role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}>
          <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="keshia-preview-title">
            <div className={styles.dialogHeader}>
              <div>
                <div className={styles.kicker}>Real client site · Seeking representation</div>
                <h2 id="keshia-preview-title">Keshia Sophia Jean</h2>
              </div>
              <button ref={closeRef} type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Close full-page preview">
                Close <span aria-hidden="true">×</span>
              </button>
            </div>

            <div className={styles.tabs} role="group" aria-label="Choose screenshot">
              <button type="button" className={view === 'desktop' ? styles.activeTab : ''} onClick={() => setView('desktop')} aria-pressed={view === 'desktop'}>Desktop</button>
              <button type="button" className={view === 'phone' ? styles.activeTab : ''} onClick={() => setView('phone')} aria-pressed={view === 'phone'}>Phone</button>
            </div>

            <div className={styles.scroller}>
              {view === 'desktop' ? (
                <Image
                  src="/assets/img/keshia-sophia-jean-desktop-full.jpg"
                  alt="Full page of Keshia Sophia Jean's actor website, top to bottom."
                  width={397}
                  height={2048}
                  sizes="(max-width: 860px) 92vw, 760px"
                  className={styles.fullDesktop}
                />
              ) : (
                <Image
                  src="/assets/img/keshia-sophia-jean-phone-full.jpg"
                  alt="Full page of Keshia Sophia Jean's actor website, top to bottom."
                  width={156}
                  height={2048}
                  sizes="(max-width: 860px) 62vw, 320px"
                  className={styles.fullPhone}
                />
              )}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
