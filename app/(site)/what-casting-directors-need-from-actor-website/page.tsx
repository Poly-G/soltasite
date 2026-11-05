import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '@/components/site-shell';
import { SourceList } from '@/components/source-list';
import { createPageMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = createPageMetadata({
  path: '/what-casting-directors-need-from-actor-website',
  title: 'What Casting Directors Need From an Actor Website | Solta Site',
  description: 'Casting platforms surface photos, credits, reels, skills and resume details quickly. Use those same priorities to make your actor website easier to review.',
  index: true,
});

const priorities = [
  ['A current primary headshot', 'Casting workflows start visually. Your website should make it immediately clear that the visitor found the right actor, using a current headshot that matches how you present professionally elsewhere.'],
  ['Your reel or strongest clip', 'Casting platforms surface reels and other media directly from a talent profile. On your site, performance video should be easy to find and easy to play without several clicks.'],
  ['Credits and resume information', 'Casting Networks lets casting review credits quickly and open a PDF resume for more detail. Your website should do the same: visible key credits plus a clean resume download.'],
  ['Skills and useful professional context', 'Casting profiles include skills, appearance and related details because they help assess fit. Your website does not need every database field, but accurate market, specialties and relevant skills can add context.'],
  ['A clear contact or representation route', 'Once someone wants to take the next step, representation or professional contact information should be obvious. The website should not make a visitor hunt for it.'],
];

export default function CastingDirectorActorWebsitePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'What Casting Directors Need From an Actor Website',
    description: 'A practical guide to structuring an actor website around the materials casting workflows already prioritize.',
    mainEntityOfPage: `${siteConfig.origin}/what-casting-directors-need-from-actor-website`,
    publisher: { '@id': `${siteConfig.origin}/#organization` },
    author: { '@id': `${siteConfig.origin}/#organization` },
    image: `${siteConfig.origin}/opengraph-image`,
    datePublished: '2026-11-05',
    dateModified: '2026-11-05',
    citation: [
      'https://support.castingnetworks.com/en/articles/11241473',
      'https://support.castingnetworks.com/en/articles/11227969',
      'https://support.castingnetworks.com/en/articles/12319233',
      'https://support.castingnetworks.com/en/articles/11226625',
    ],
  };

  return (
    <div className="solta-site">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <SiteHeader />
      <main id="main">
        <section className="wrap sec" style={{ paddingTop: '72px' }}>
          <div style={{ maxWidth: '930px' }}>
            <div className="eyebrow">Actor website guide</div>
            <h1>What do casting directors need from an actor website?</h1>
            <p className="lead">A personal website does not replace a casting profile, and casting directors do not need every actor to have one. But if they open your site, it should make the same professional material they already review elsewhere easy to find: a current photo, performance media, credits, resume information and a clear contact route.</p>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div className="card pad dark" style={{ maxWidth: '940px' }}>
            <div className="cap">The useful rule</div>
            <h2 style={{ paddingTop: '10px' }}>Do not invent a new workflow for the visitor.</h2>
            <p className="p">Casting Networks lets casting open a talent profile and quickly review photos, credits and reels, then drill into assets, skills and additional information. Your website should make those same core materials just as easy to scan.</p>
          </div>
        </section>

        <section className="band">
          <div className="wrap sec">
            <div style={{ maxWidth: '980px' }}>
              <div className="cap">Five priorities</div>
              <h2 style={{ paddingTop: '10px' }}>Put the actor materials before the website flourishes.</h2>
              <div className="cols2" style={{ marginTop: '34px' }}>
                {priorities.map(([title, body]) => (
                  <article className="card pad" key={title}>
                    <h3>{title}</h3>
                    <p className="p">{body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="wrap sec">
          <div style={{ maxWidth: '940px' }}>
            <div className="cap">What the site should not try to replace</div>
            <h2 style={{ paddingTop: '10px' }}>Keep your casting profiles current first.</h2>
            <p className="lead">Casting platforms handle submissions, role requirements, requested media and profile-level information that a personal website cannot replace. Casting can even specify particular photos, video, audio, resumes or self-tapes for an individual role.</p>
            <p className="p">Your website is most useful as a clean professional destination after someone searches your name, follows your resume link, gets referred to you or wants a broader view of your work.</p>
            <div className="ctas" style={{ paddingTop: '24px' }}>
              <Link className="link" href="/do-actors-need-a-website">See when actors actually need a website <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/actor-seo">Make the site easier to find by your name <span className="ar" aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        <section className="band">
          <div className="wrap sec">
            <div style={{ maxWidth: '940px' }}>
              <div className="cap">A simple page order</div>
              <h2 style={{ paddingTop: '10px' }}>If someone only gives the page a quick scan, the essentials should still land.</h2>
              <div style={{ display: 'grid', gap: '20px', marginTop: '30px' }}>
                <div><h3>1. Name + current headshot</h3><p className="p">Confirm identity immediately.</p></div>
                <div><h3>2. Reel or strongest clip</h3><p className="p">Let the work play without forcing a visitor through a menu.</p></div>
                <div><h3>3. Credits + resume</h3><p className="p">Show the important credits on-page and offer the full PDF when needed.</p></div>
                <div><h3>4. Representation or contact</h3><p className="p">Make the next step obvious without exposing private personal details.</p></div>
              </div>
              <div className="ctas" style={{ paddingTop: '24px' }}>
                <Link className="link" href="/actor-website-examples">See actor website examples <span className="ar" aria-hidden="true">→</span></Link>
                <Link className="link" href="/what-to-put-on-an-actor-website">Use the full actor website checklist <span className="ar" aria-hidden="true">→</span></Link>
                <Link className="link" href="/acting-portfolio-website">Build the portfolio step by step <span className="ar" aria-hidden="true">→</span></Link>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap sec">
          <div style={{ maxWidth: '940px' }}>
            <div className="cap">Design still matters — just second</div>
            <h2 style={{ paddingTop: '10px' }}>The visual direction should support the performer.</h2>
            <p className="lead">A dark cinematic site, bright commercial site and editorial theatre site can all work. The shared requirement is that the design does not make the actor materials harder to find.</p>
            <p className="p">That is the distinction our <Link href="/actor-website-examples">actor website examples</Link> are built to show: different styles, same professional hierarchy.</p>
          </div>
        </section>

        <SourceList reviewed="November 5, 2026" sources={[
          { name: 'Casting Networks: viewing a talent profile', href: 'https://support.castingnetworks.com/en/articles/11241473', note: 'Casting directors can quickly view photos, credits and reels, then open the full talent profile for more detail.' },
          { name: 'Casting Networks: managing a talent profile', href: 'https://support.castingnetworks.com/en/articles/11227969', note: 'Talent profiles include media, skills, appearance details, credits and PDF resume information.' },
          { name: 'Casting Networks: adding a role', href: 'https://support.castingnetworks.com/en/articles/12319233', note: 'Casting can request specific media such as images, resumes, reels and self-tapes for individual roles.' },
          { name: 'Casting Networks: managing media', href: 'https://support.castingnetworks.com/en/articles/11226625', note: 'Talent can arrange primary photos and reels and control which media appears on each profile.' },
        ]} />

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div className="close">
            <div className="circ"></div>
            <div className="in">
              <h2>Want the essentials organized into a professional actor site?</h2>
              <p className="lead">Send us your headshots, reel, resume, credits and contact information. Solta Site builds the site around the performer and puts it live on your domain for $499 once.</p>
              <div className="ctas">
                <Link className="btn" href="/start">Start your site · $499 <span className="ar" aria-hidden="true">→</span></Link>
                <Link className="link" href="/actor-website-design">See the service details <span className="ar" aria-hidden="true">→</span></Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
