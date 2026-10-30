import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DemoAction } from "@/components/examples/demo-action";
import { devonPhotos } from "@/components/examples/example-photos";
import { PhotoGallery } from "@/components/examples/photo-gallery";
import { ReelDemo } from "@/components/examples/reel-demo";
import { interTight } from "@/lib/fonts";
import styles from "./devon.module.css";

export const metadata: Metadata = {
  title: { absolute: "Devon Hale · Actor · Stage and screen, New York" },
  description: "Example actor site by Solta. Devon Hale, a fictional theatre and film actor in New York.",
  robots: { index: false, follow: true },
};

const credits = [
  { title: "The Long Winter", role: "Thomas", where: "Harbor Street Theatre", year: "2026" },
  { title: "Night Shift", role: "Officer Reyes", where: "Meridian TV · guest star", year: "2025", scene: true },
  { title: "Glass Hours", role: "Eli", where: "The Lantern Company", year: "2025" },
  { title: "Paper Boats", role: "Sam", where: "Coldwater Films · lead", year: "2024", scene: true },
  { title: "Saint Joan", role: "Dunois", where: "West 4th Playhouse", year: "2024" },
  { title: "The Tenant", role: "Marcus", where: "Lantern Pictures · supporting", year: "2023" },
] satisfies { title: string; role: string; where: string; year: string; scene?: boolean }[];

export default function DevonExamplePage() {
  // Fictional actor. Example site by Solta, soltasite.com. Photos are licensed stock.
  return (
    <div className={`${styles.page} ${interTight.variable}`}>
      <a href="#devon-content" className="skip-link">Skip to main content</a>
      <header className={styles.hero} id="top">
        <div className={styles.heroImageFrame}>
          <Image
            src="/assets/img/devon-7.jpg"
            alt="Devon Hale, a fictional actor example"
            width={1350}
            height={1800}
            sizes="100vw"
            preload
            className={styles.heroImage}
          />
        </div>
        <nav className={styles.navigation} aria-label="Devon example navigation">
          <b>Devon Hale</b>
          <ul>
            <li><a href="#work">Work</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#reel">Reel</a></li>
            <li><a href="#headshots">Headshots</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        <div className={styles.heroCopy}>
          <h1 className={styles.name}>Devon Hale</h1>
          <div className={styles.subtitle}>
            <p>Stage and screen · New York<br /><span className={styles.represented}>Represented by Northgate Talent</span></p>
            <a className={styles.button} href="#reel">Watch the reel <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </header>
      <main id="devon-content" tabIndex={-1}>
        <section className={styles.work} id="work" aria-labelledby="devon-work-heading">
          <h2 id="devon-work-heading" className="sr-only">Selected work</h2>
          <div className={`${styles.tableHead} ${styles.caption}`} aria-hidden="true">
            <span>Selected work</span><span>Role</span><span>Where</span><span>Year</span>
          </div>
          {credits.map((credit) => (
            <article className={styles.workRow} key={credit.title}>
              <h3 className={styles.creditTitle}>
                {credit.title}
                {credit.scene ? <a className={styles.watchScene} href="#reel"><span aria-hidden="true">▶ </span>Watch scene</a> : null}
              </h3>
              <div className={styles.creditMeta}><span className={styles.metaLabel}>Role </span>{credit.role}</div>
              <div className={styles.creditMeta}><span className={styles.metaLabel}>Where </span>{credit.where}</div>
              <div className={styles.creditMeta}><span className="sr-only">Year </span>{credit.year}</div>
            </article>
          ))}
          <div className={styles.workFooter}>
            <span>Selected from 14 credits</span>
            <DemoAction title="Example résumé" message="Devon is a fictional actor. On your site, this button downloads your acting résumé as a PDF.">Full resume (PDF) <span aria-hidden="true">→</span></DemoAction>
          </div>
        </section>
        <section className={styles.about} id="about" aria-labelledby="devon-about-heading">
          <h2 className={styles.caption} id="devon-about-heading">About</h2>
          <p>AEA. BFA in Acting from Eastern Conservatory. Plays 22 to 30. 6 ft, brown hair, blue eyes. Classical verse, stage combat, Irish and RP accents. Based in New York, local to Philadelphia.</p>
        </section>
        <ReelDemo variant="devon" id="reel" />
        <PhotoGallery variant="devon" photos={devonPhotos} />
      </main>
      <footer className={styles.contact} id="contact">
        <div className={styles.caption}>Representation</div>
        <h2 className={styles.agency}>Northgate Talent <span aria-hidden="true">→</span></h2>
        <div className={styles.contactActions}>
          <DemoAction>Email the agency <span aria-hidden="true">→</span></DemoAction>
          <DemoAction>Call the agency <span aria-hidden="true">→</span></DemoAction>
          <DemoAction>Self-submissions: email Devon <span aria-hidden="true">→</span></DemoAction>
        </div>
        <div className={styles.footer}>
          <span>© 2026 Devon Hale · Fictional actor · Site by Solta · <Link className={styles.footerLink} href="/">soltasite.com</Link></span>
          <nav aria-label="Devon example profiles">
            {["IMDb", "Actors Access", "Instagram"].map((profile) => <DemoAction key={profile}>{profile}</DemoAction>)}
          </nav>
        </div>
      </footer>
    </div>
  );
}
