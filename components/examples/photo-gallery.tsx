"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { DemoAction } from "./demo-action";
import styles from "./photo-gallery.module.css";

export type ExamplePhoto = {
  src: string;
  alt: string;
  label: string;
  width: number;
  height: number;
  position?: string;
  scale?: number;
};

type PhotoGalleryProps = {
  variant: "maya" | "devon";
  photos: readonly ExamplePhoto[];
};

export function PhotoGallery({ variant, photos }: PhotoGalleryProps) {
  const [expanded, setExpanded] = useState(false);
  const galleryId = useId();
  const headingId = useId();
  const isMaya = variant === "maya";
  const visiblePhotos = expanded ? photos : photos.slice(0, 3);

  return (
    <section
      id={isMaya ? "photos" : "headshots"}
      className={`${styles.gallery} ${isMaya ? styles.maya : styles.devon}`}
      aria-labelledby={headingId}
    >
      <div className={styles.top}>
        <h2 id={headingId} className={styles.heading}>
          {isMaya ? "Photos" : "Headshots"}
        </h2>
        <div className={styles.actions}>
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={galleryId}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? "Show fewer" : `View all ${photos.length}`} <span aria-hidden="true">{expanded ? "↑" : "→"}</span>
          </button>
          <DemoAction
            title="Example photo downloads"
            message="These are licensed stock photos for a fictional actor. On your site, this button downloads your own headshots. You can explore every example photo with View all."
          >
            Download all{isMaya ? "" : " →"}
          </DemoAction>
          {isMaya ? <span className={styles.count}>{photos.length} photos</span> : null}
        </div>
      </div>
      <div id={galleryId} className={styles.grid}>
        {visiblePhotos.map((photo) => (
          <figure key={photo.src} className={styles.photo}>
            <div className={styles.frame}>
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes={isMaya
                  ? "(max-width: 860px) calc((100vw - 60px) / 3), calc((100vw - 528px) / 3)"
                  : "(max-width: 860px) calc(100vw - 40px), calc((100vw - 160px) / 3)"}
                style={{
                  objectPosition: photo.position ?? "50% 35%",
                  transform: photo.scale ? `scale(${photo.scale})` : undefined,
                  transformOrigin: photo.position ?? "50% 35%",
                }}
              />
            </div>
            <figcaption className={styles.label}>{photo.label}</figcaption>
          </figure>
        ))}
      </div>
      <span className="sr-only" role="status">
        {expanded ? `Showing all ${photos.length} photos.` : `Showing 3 of ${photos.length} photos.`}
      </span>
    </section>
  );
}
