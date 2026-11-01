import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '@/components/site-shell';
import { createPageMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';
import { SourceList } from '@/components/source-list';

export const metadata: Metadata = createPageMetadata({
  path: '/what-to-put-on-an-actor-website',
  title: 'What Should an Actor Website Include? Checklist | Solta Site',
  description: 'An actor website should make your current headshot, reel, resume, credits, representation and contact information easy to find. Use this practical checklist before you publish.',
  index: true,
});

const essentials = [
  {
    title: '1. Your current headshot',
    body: 'Lead with a strong photo that looks like you now. Someone landing on your site should be able to confirm they found the right actor immediately.',
  },
  {
    title: '2. Your reel or strongest clip',
    body: 'Make video easy to play, especially on a phone. Put your strongest work first instead of making visitors dig through a media page.',
  },
  {
    title: '3. Resume, credits and training',
    body: 'Show the important credits on the page and give people a clean downloadable resume when they need the full version.',
  },
  {
    title: '4. Representation or a safe contact route',
    body: 'List your agent or manager when you have one. If you are unrepresented, use a professional email or contact form instead of publishing private personal details.',
  },
  {
    title: '5. A few useful links',
    body: 'Link the professional profiles people already use to verify your work, such as IMDb and casting platforms, plus relevant social accounts if they support your acting career.',
  },
];

export default function ActorWebsiteChecklistPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'What Should an Actor Website Include?',
    description: 'A practical checklist for the essential content on an actor website.',
    mainEntityOfPage: `${siteConfig.origin}/what-to-put-on-an-actor-website`,
    publisher: { '@id': `${siteConfig.origin}/#organization` },
    datePublished: '2026-10-31',
    dateModified: '2026-11-01',
    citation: ["https://actorsaccess.com/","https://support.castingnetworks.com/en/articles/11240193","https://help.imdb.com/article/imdbpro/industry-research/name-title-company-pages-faq/GLY9HY48QGA9F5QC"],
  };

  return (
    <div className="solta-site">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <SiteHeader />
      <main id="main">
        <section className="wrap sec" style={{ paddingTop: '72px' }}>
          <div style={{ maxWidth: '900px' }}>
            <div className="eyebrow">Actor website checklist</div>
            <h1>What should an actor website include?</h1>
            <p className="lead">An actor website does not need dozens of pages. It needs to answer a few questions quickly: who are you, what do you look like now, what does your work look like, what have you done, and how should someone reach you?</p>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div style={{ maxWidth: '980px' }}>
            <div className="cap">The essentials</div>
            <h2 style={{ paddingTop: '10px' }}>Five things should be obvious within a few seconds.</h2>
            <div className="cols2" style={{ marginTop: '36px' }}>
              {essentials.map((item) => (
                <article className="card pad" key={item.title}>
                  <h3>{item.title}</h3>
                  <p className="p">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="band">
          <div className="wrap sec">
            <div style={{ maxWidth: '900px' }}>
              <div className="cap">A simple order that works</div>
              <h2 style={{ paddingTop: '10px' }}>Build the page around how people actually scan it.</h2>
              <div style={{ display: 'grid', gap: '22px', marginTop: '32px' }}>
                <div>
                  <h3>Top of the page</h3>
                  <p className="p">Your name, current headshot, what kind of performer you are, and a direct path to your reel.</p>
                </div>
                <div>
                  <h3>Middle</h3>
                  <p className="p">Credits, training, additional headshots and a short professional bio only if it adds useful context.</p>
                </div>
                <div>
                  <h3>Bottom</h3>
                  <p className="p">Representation or contact details, professional profile links and a downloadable resume.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap sec">
          <div style={{ maxWidth: '900px' }}>
            <div className="cap">What to leave off</div>
            <h2 style={{ paddingTop: '10px' }}>More information does not automatically make the site better.</h2>
            <div className="cols2" style={{ marginTop: '36px' }}>
              <div className="card pad">
                <h3>Private personal information</h3>
                <p className="p">Your home address, exact birthday and other private details do not belong on a public page. A city or market is usually enough.</p>
              </div>
              <div className="card pad">
                <h3>Old material</h3>
                <p className="p">Outdated headshots, stale reels and credits you no longer want associated with your current work can weaken the page more than an intentionally smaller portfolio.</p>
              </div>
              <div className="card pad">
                <h3>Too many clicks</h3>
                <p className="p">Do not bury the reel or contact information behind several layers of navigation. Busy visitors should be able to find the important material immediately.</p>
              </div>
              <div className="card pad">
                <h3>Design for design's sake</h3>
                <p className="p">The site can have personality without competing with your face, reel and credits. The performer should still be the main visual.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div style={{ maxWidth: '900px' }}>
            <div className="cap">One page or several?</div>
            <h2 style={{ paddingTop: '10px' }}>Start with the amount of structure your material actually needs.</h2>
            <p className="lead">A newer actor with one reel, a resume and a few strong headshots can work very well on one scrolling page. An actor with a long theatre history, multiple reels or substantial press may need more room. The goal is not a page count. The goal is making the useful material easy to scan.</p>
            <p className="p">Still deciding whether you need a site at all? <Link href="/do-actors-need-a-website">Read when an actor website is worth having →</Link></p>
            <div className="ctas" style={{ paddingTop: '24px' }}>
              <Link className="link" href="/actor-website-examples">See actor website examples <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/actor-website-cost">See what actor websites cost <span className="ar" aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        <SourceList reviewed="November 1, 2026" sources={[
          { name: 'Actors Access', href: 'https://actorsaccess.com/', note: 'Profiles center headshots, résumé and performance media.' },
          { name: 'Casting Networks: viewing a talent profile', href: 'https://support.castingnetworks.com/en/articles/11240193', note: 'Talent profiles surface photos, credits, reels and related assets.' },
          { name: 'IMDbPro name pages', href: 'https://help.imdb.com/article/imdbpro/industry-research/name-title-company-pages-faq/GLY9HY48QGA9F5QC', note: 'IMDbPro name pages include credits, contacts, official websites, images and videos.' },
        ]} />
        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div className="close">
            <div className="circ"></div>
            <div className="in">
              <h2>Send us the material. We organize it into the site.</h2>
              <p className="lead">Solta Site builds the actor website for you, puts it on your own domain, and includes hosting for $499 once.</p>
              <div className="ctas">
                <Link className="btn" href="/start">Start your site · $499 <span className="ar" aria-hidden="true">→</span></Link>
                <Link className="link" href="/">See what is included <span className="ar" aria-hidden="true">→</span></Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
