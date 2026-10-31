import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '@/components/site-shell';
import { createPageMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = createPageMetadata({
  path: '/actor-website-design',
  title: 'Actor Website Design · Built for You for $499 Once | Solta Site',
  description: 'Done-for-you actor website design with your headshots, reel, resume, credits and contact details on your own domain. Built in 5 business days for $499 once.',
  index: true,
});

export default function ActorWebsiteDesignPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Actor website design',
    serviceType: 'Website design for actors',
    provider: { '@id': `${siteConfig.origin}/#organization` },
    areaServed: 'US',
    url: `${siteConfig.origin}/actor-website-design`,
    description: 'Done-for-you actor website design with headshots, reel, resume, credits and professional contact information.',
  };

  return (
    <div className="solta-site">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <SiteHeader />
      <main id="main">
        <section className="wrap sec" style={{ paddingTop: '72px' }}>
          <div style={{ maxWidth: '930px' }}>
            <div className="eyebrow">Actor website design</div>
            <h1>Actor websites, designed around the performer.</h1>
            <p className="lead">Your headshot, reel, resume, credits and contact information on your own domain. We design and build the site for you. $499 once.</p>
            <p className="p">Comparing DIY tools first? <Link href="/actor-website-builder">See actor website builders vs done-for-you design →</Link></p>
            <p className="p">Need the search side too? <Link href="/actor-seo">See our SEO for actors guide →</Link></p>
            <div className="ctas" style={{ paddingTop: '24px' }}>
              <Link className="btn" href="/start">Start your site · $499 <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/actor-website-examples">See actor website examples <span className="ar" aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        <section className="band">
          <div className="wrap sec">
            <div style={{ maxWidth: '960px' }}>
              <div className="cap">What we design around</div>
              <h2 style={{ paddingTop: '10px' }}>The site should make your work easier to see, not harder.</h2>
              <div className="cols2" style={{ marginTop: '36px' }}>
                <div className="card pad">
                  <h3>Your current headshot</h3>
                  <p className="p">The first impression should be the performer, not a logo, splash screen or generic template graphic.</p>
                </div>
                <div className="card pad">
                  <h3>Your reel</h3>
                  <p className="p">The reel gets a clear route near the top of the site so a visitor can watch your work without searching for it.</p>
                </div>
                <div className="card pad">
                  <h3>Your credits and resume</h3>
                  <p className="p">Important credits are easy to scan, with a downloadable resume when someone needs the full version.</p>
                </div>
                <div className="card pad">
                  <h3>Your representation or contact route</h3>
                  <p className="p">We show the right professional contact information without forcing you to publish private personal details.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap sec">
          <div style={{ maxWidth: '940px' }}>
            <div className="cap">Designed for phones first</div>
            <h2 style={{ paddingTop: '10px' }}>Because that is where someone may open it.</h2>
            <p className="lead">An actor site should work when someone is moving quickly between meetings, auditions or sets. Headshots should load cleanly, the reel should be easy to tap, text should be readable without zooming, and contact information should not require digging through menus.</p>
          </div>
        </section>

        <section className="band">
          <div className="wrap sec">
            <div style={{ maxWidth: '960px' }}>
              <div className="cap">What you get</div>
              <h2 style={{ paddingTop: '10px' }}>A done-for-you actor website, not a DIY subscription.</h2>
              <div className="cols2" style={{ marginTop: '36px' }}>
                <div className="card pad dark">
                  <div className="cap">One-time</div>
                  <h3>$499</h3>
                  <p className="p">You pay once for the build. Hosting is included, with no monthly hosting fee from Solta Site.</p>
                </div>
                <div className="card pad">
                  <h3>Your own domain</h3>
                  <p className="p">The domain stays in your name. Already have one? We connect it. Need one? We help you get it set up.</p>
                </div>
                <div className="card pad">
                  <h3>Two rounds of changes</h3>
                  <p className="p">You review the site before launch and get two consolidated rounds of changes to make sure the final direction feels right.</p>
                </div>
                <div className="card pad">
                  <h3>Two updates a year included</h3>
                  <p className="p">New headshots, a new reel or a representation change should not require rebuilding the site from scratch.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap sec">
          <div style={{ maxWidth: '940px' }}>
            <div className="cap">Not a generic actor template</div>
            <h2 style={{ paddingTop: '10px' }}>Different actors should not all look the same online.</h2>
            <p className="lead">A film and television actor may need a darker cinematic presentation. A commercial actor may need something brighter and more personality-forward. A theatre actor may need more room for credits and training.</p>
            <p className="p">The core material can stay simple while the visual direction changes around the performer. That is why our examples look different even though they solve the same basic problem.</p>
            <div className="ctas" style={{ paddingTop: '24px' }}>
              <Link className="link" href="/actor-website-examples">Browse actor website examples <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/what-to-put-on-an-actor-website">See the actor website checklist <span className="ar" aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div style={{ maxWidth: '940px' }}>
            <div className="cap">Why done-for-you?</div>
            <h2 style={{ paddingTop: '10px' }}>You can build a website yourself. You do not have to.</h2>
            <div className="cols2" style={{ marginTop: '32px' }}>
              <div className="card pad">
                <h3>DIY builder</h3>
                <p className="p">You choose the template, crop images, build pages, connect the domain, test mobile layouts and keep paying the platform while the site is live.</p>
              </div>
              <div className="card pad dark">
                <h3>Solta Site</h3>
                <p className="p">You send the materials. We make the design decisions, build the site, connect the domain and get it live.</p>
              </div>
            </div>
            <div className="ctas" style={{ paddingTop: '24px' }}>
              <Link className="link" href="/actor-website-cost">See the actor website cost breakdown <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/do-actors-need-a-website">Not sure you need one yet? <span className="ar" aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div className="close">
            <div className="circ"></div>
            <div className="in">
              <h2>Your materials. Your name. Your site.</h2>
              <p className="lead">Built for you and live on your domain in 5 business days after we have your materials.</p>
              <div className="ctas">
                <Link className="btn" href="/start">Start your site · $499 <span className="ar" aria-hidden="true">→</span></Link>
                <Link className="link" href="/actor-website-examples">See the examples <span className="ar" aria-hidden="true">→</span></Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
