import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DemoAction } from "@/components/examples/demo-action";
import { mayaPhotos } from "@/components/examples/example-photos";
import { PhotoGallery } from "@/components/examples/photo-gallery";
import { ReelDemo } from "@/components/examples/reel-demo";
import { rubik, workSans } from "@/lib/fonts";
import styles from "./maya.module.css";

export const metadata: Metadata = {
  title: { absolute: "Maya Ortiz · Actor · Comedy and commercial, Los Angeles" },
  description: "Example actor site by Solta. Maya Ortiz, a fictional comedy and commercial actor in Los Angeles.",
  robots: { index: false, follow: true },
};

const televisionCredits = [
  ["Roommates Anonymous", "Series regular"],
  ["Late Check-In", "Guest star"],
  ["Office Hours", "Co-star, pilot"],
  ["Sunday Scaries", "Recurring, web series"],
] as const;

type CreditGroupProps = {
  title: string;
  credits: readonly (readonly [string, string])[];
};

function CreditGroup({ title, credits }: CreditGroupProps) {
  return (
    <div className={styles.creditGroup}>
      <h3 className={styles.groupLabel}>{title}</h3>
      <dl>
        {credits.map(([production, role]) => (
          <div key={production} className={styles.credit}>
            <dt>{production}</dt>
            <dd>{role}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function MayaExamplePage() {
  // Fictional actor. Example site by Solta, soltasite.com. Photos are licensed stock.
  return (
    <div className={`${styles.page} ${rubik.variable} ${workSans.variable}`}>
      <a href="#maya-content" className="skip-link">Skip to main content</a>
      <header className={styles.hero} id="top">
        <div className={styles.heroImageFrame}>
          <Image
            src="/assets/img/maya-7.jpg"
            alt="Maya Ortiz, a fictional actor example"
            width={1200}
            height={1800}
            sizes="100vw"
            preload
            className={styles.heroImage}
          />
        </div>
        <div className={styles.heroShade} aria-hidden="true" />
        <nav className={styles.navigation} aria-label="Maya example navigation">
          <b>Maya Ortiz</b>
          <ul>
            <li><a href="#reel">Reel</a></li>
            <li><a href="#credits">Credits</a></li>
            <li><a href="#photos">Photos</a></li>
            <li><a className={styles.pill} href="#book">Book Maya</a></li>
          </ul>
        </nav>
        <div className={styles.heroCopy}>
          <h1 className={styles.name}>Maya<br />Ortiz</h1>
          <p className={styles.subtitle}>Comedy and commercial actor in Los Angeles.</p>
          <div className={styles.heroButton}>
            <a className={styles.pill} href="#reel"><span aria-hidden="true">▶ </span>Watch the reel</a>
          </div>
        </div>
      </header>
      <main id="maya-content" tabIndex={-1}>
        <section className={styles.section} id="reel" aria-labelledby="maya-reel-heading">
          <div>
            <h2 className={styles.label} id="maya-reel-heading">Reel</h2>
            <div className={styles.subLabel}>
              <span className={styles.underline}>Comedy · 1:05</span><br />
              <span className={styles.dim}>Commercial · 0:48</span>
            </div>
          </div>
          <ReelDemo variant="maya" />
        </section>
        <section className={styles.section} id="credits" aria-labelledby="maya-credits-heading">
          <div>
            <h2 className={styles.label} id="maya-credits-heading">Credits</h2>
            <div className={styles.subLabel}>
              <DemoAction className={styles.underline} title="Example résumé" message="Maya is a fictional actor. On your site, this button downloads your acting résumé as a PDF.">Download resume</DemoAction>
              <br />
              <span className={styles.dim}>SAG-AFTRA · 5 ft 5 · plays 20 to 28<br />Brown hair, brown eyes · fluent Spanish</span>
            </div>
          </div>
          <div className={styles.creditColumns}>
            <div><CreditGroup title="TV and web" credits={televisionCredits} /></div>
            <div>
              <CreditGroup title="Commercial" credits={[["Conflicts", "Available on request"], ["Spots", "On the commercial reel"]]} />
              <CreditGroup title="Stage and improv" credits={[["Sunset Improv Collective", "House team"], ["Lot 9 Comedy", "Sketch revue"]]} />
            </div>
          </div>
        </section>
        <PhotoGallery variant="maya" photos={mayaPhotos} />
      </main>
      <footer>
        <section className={`${styles.section} ${styles.book}`} id="book" aria-labelledby="maya-book-heading">
          <div>
            <h2 className={styles.label} id="maya-book-heading">Book Maya</h2>
            <div className={styles.subLabel}>Represented by Brightline Talent<br />Commercial and theatrical</div>
          </div>
          <div>
            <p className={styles.bookingCopy}>For auditions, callbacks and bookings, go through my agent.</p>
            <div className={styles.contactActions}>
              <DemoAction className={styles.pill}>Email my agent <span aria-hidden="true">→</span></DemoAction>
              <DemoAction className={`${styles.underline} ${styles.callAgency}`}>Call the agency</DemoAction>
            </div>
            <nav className={styles.socials} aria-label="Maya example profiles">
              {["Instagram", "TikTok", "IMDb", "Actors Access"].map((profile) => (
                <DemoAction key={profile} className={styles.underline}>{profile}</DemoAction>
              ))}
            </nav>
          </div>
        </section>
        <div className={styles.footer}>
          <span>© 2026 Maya Ortiz · Fictional actor</span>
          <span>Site by Solta · <Link className={styles.footerLink} href="/">soltasite.com</Link></span>
        </div>
      </footer>
    </div>
  );
}
