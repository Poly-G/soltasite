import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '@/components/site-shell';
import { SourceList } from '@/components/source-list';
import { createPageMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = createPageMetadata({
  path: '/acting-portfolio-website',
  title: 'How to Make an Acting Portfolio Website | Solta Site',
  description: 'Build an acting portfolio website step by step: choose your strongest headshot and reel, organize credits and resume, add professional contact details, connect a domain, and test the final site.',
  index: true,
});

const steps = [
  ['1. Gather the materials first', 'Start with current headshots, your strongest reel or clip, resume, credits and training, representation or a professional contact route, and the links you actually want a visitor to use.'],
  ['2. Decide what goes first', 'Your name, current headshot and strongest work should do the heavy lifting at the top. The first screen should confirm who you are and give a direct route to the reel.'],
  ['3. Build around proof, not filler', 'Use the middle for credits, training, selected headshots and a short bio when it adds useful context. Keep the strongest work from getting buried.'],
  ['4. Make contact obvious', 'Show representation when you have it. If you are unrepresented, use a professional email or contact form instead of publishing private details.'],
  ['5. Connect your own domain', 'A name-based domain gives you one address for resumes, email signatures, casting profiles and social bios. Link relevant professional profiles back to it.'],
  ['6. Test it like a stranger would', 'Open the site on a phone, play the reel, download the resume, tap every contact route and make sure the current headshot loads cleanly.'],
];

export default function ActingPortfolioWebsitePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Make an Acting Portfolio Website',
    description: 'A step-by-step guide to building an acting portfolio website around current headshots, reel, resume, credits and professional contact information.',
    mainEntityOfPage: `${siteConfig.origin}/acting-portfolio-website`,
    publisher: { '@id': `${siteConfig.origin}/#organization` },
    author: { '@id': `${siteConfig.origin}/#organization` },
    image: `${siteConfig.origin}/opengraph-image`,
    datePublished: '2026-11-04',
    dateModified: '2026-11-04',
    citation: [
      'https://actorsaccess.com/',
      'https://support.castingnetworks.com/en/articles/11241473',
      'https://support.castingnetworks.com/en/articles/11227969',
    ],
  };

  return (
    <div className="solta-site">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <SiteHeader />
      <main id="main">
        <section className="wrap sec" style={{ paddingTop: '72px' }}>
          <div style={{ maxWidth: '930px' }}>
            <div className="eyebrow">Acting portfolio website guide</div>
            <h1>How do you make an acting portfolio website?</h1>
            <p className="lead">Start with the materials casting and representation already expect to evaluate: a current headshot, strong performance media, credits or resume, and a clear professional contact route. Then build the website around making those things easy to see.</p>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div className="card pad dark" style={{ maxWidth: '940px' }}>
            <div className="cap">The short answer</div>
            <h2 style={{ paddingTop: '10px' }}>An acting portfolio is a fast professional introduction.</h2>
            <p className="p">Casting platforms already organize actor profiles around photos, credits, resumes and media. Your personal portfolio should take the same core material and present it under your own name, in the order you want a visitor to experience it.</p>
          </div>
        </section>

        <section className="band">
          <div className="wrap sec">
            <div style={{ maxWidth: '980px' }}>
              <div className="cap">Step by step</div>
              <h2 style={{ paddingTop: '10px' }}>Build the portfolio from the material outward.</h2>
              <div style={{ display: 'grid', gap: '22px', marginTop: '34px' }}>
                {steps.map(([title, body]) => (
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
            <div className="cap">A simple structure</div>
            <h2 style={{ paddingTop: '10px' }}>Many actors can start with one clean page.</h2>
            <div className="cols2" style={{ marginTop: '34px' }}>
              <div className="card pad"><h3>Top</h3><p className="p">Professional name, current headshot, actor context and a direct reel action.</p></div>
              <div className="card pad"><h3>Middle</h3><p className="p">Credits, training, selected headshots and a short bio only when it adds useful context.</p></div>
              <div className="card pad"><h3>Bottom</h3><p className="p">Representation or contact route, downloadable resume, IMDb or casting-profile links and relevant social accounts.</p></div>
              <div className="card pad dark"><h3>One page can be enough</h3><p className="p">If the material can be scanned cleanly on one page, extra pages do not automatically make the portfolio stronger.</p></div>
            </div>
            <div className="ctas" style={{ paddingTop: '24px' }}>
              <Link className="link" href="/what-to-put-on-an-actor-website">Use the full actor website checklist <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/actor-website-examples">See actor website examples <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/what-casting-directors-need-from-actor-website">See what casting needs to find quickly <span className="ar" aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        <section className="band">
          <div className="wrap sec">
            <div style={{ maxWidth: '940px' }}>
              <div className="cap">What not to prioritize</div>
              <h2 style={{ paddingTop: '10px' }}>Professional does not have to mean complicated.</h2>
              <div className="cols2" style={{ marginTop: '34px' }}>
                <div className="card pad"><h3>A long autobiography</h3><p className="p">A short useful bio can help. A life story should not push the reel, credits or contact information farther down the page.</p></div>
                <div className="card pad"><h3>Every photo you own</h3><p className="p">Choose current, useful looks. More images do not automatically make the portfolio stronger.</p></div>
                <div className="card pad"><h3>Fancy navigation</h3><p className="p">If someone has to learn the interface before they can watch the reel, the design is getting in the way.</p></div>
                <div className="card pad"><h3>Keyword filler</h3><p className="p">Use your professional name and accurate context naturally instead of repeating search phrases across the page.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap sec">
          <div style={{ maxWidth: '940px' }}>
            <div className="cap">DIY or done-for-you?</div>
            <h2 style={{ paddingTop: '10px' }}>Making the portfolio and learning a website builder are different jobs.</h2>
            <p className="lead">If you enjoy layouts, image crops, mobile testing and domain setup, a DIY builder can work well. If you mainly want the finished portfolio, a done-for-you build removes those decisions from your plate.</p>
            <div className="ctas" style={{ paddingTop: '24px' }}>
              <Link className="link" href="/actor-website-builder">Compare DIY builders vs done-for-you <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/best-website-builder-for-actors">Compare the best website builders for actors <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/actor-website-cost">See the actor website cost breakdown <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/actor-seo">Make the portfolio easier to find by name <span className="ar" aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        <SourceList reviewed="November 4, 2026" sources={[
          { name: 'Actors Access', href: 'https://actorsaccess.com/', note: 'Actors Access centers actor profiles around headshots, résumé and performance media.' },
          { name: 'Casting Networks: viewing a talent profile', href: 'https://support.castingnetworks.com/en/articles/11241473', note: 'Casting directors can review photos, credits, reels and resume information from talent profiles.' },
          { name: 'Casting Networks: managing a talent profile', href: 'https://support.castingnetworks.com/en/articles/11227969', note: 'Casting Networks describes talent profiles as digital resumes with media, credits, resume, skills and current professional information.' },
        ]} />

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div className="close">
            <div className="circ"></div>
            <div className="in">
              <h2>Want the acting portfolio without building it yourself?</h2>
              <p className="lead">Send us your headshots, reel, resume and contact information. Solta Site builds the actor website for you and puts it live on your own domain for $499 once.</p>
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
