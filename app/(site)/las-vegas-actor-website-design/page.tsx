import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '@/components/site-shell';
import { createPageMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = createPageMetadata({
  path: '/las-vegas-actor-website-design',
  title: 'Las Vegas Actor Website Design · $499 Once | Solta Site',
  description: 'Done-for-you actor websites for Las Vegas performers. Headshots, reel, resume, credits and contact on your own domain. Built for $499 once.',
  index: true,
});

const resourceLinks = [
  {
    name: 'Film Nevada',
    href: 'https://film.nv.gov/',
    text: 'Nevada’s official film office maintains production, location, crew and industry resources for work filming in the state.',
  },
  {
    name: 'Nevada Production Directory',
    href: 'https://film.nv.gov/about-us/film-nevadas-directories/',
    text: 'A statewide professional directory where approved industry listings can include credits, résumé, website, reel and social links.',
  },
  {
    name: 'UNLV Stage and Screen Acting',
    href: 'https://www.unlv.edu/theatre/stage-and-screen',
    text: 'UNLV’s acting program covers stage, film and television performance for developing performers in the Las Vegas market.',
  },
  {
    name: 'Nevada Conservatory Theatre auditions',
    href: 'https://callboard.sites.unlv.edu/auditions/',
    text: 'Current audition information for Nevada Conservatory Theatre productions and community participation.',
  },
  {
    name: 'VegasAuditions.com',
    href: 'https://www.vegasauditions.com/',
    text: 'A Las Vegas–focused audition and casting resource covering local performance opportunities.',
  },
];

export default function LasVegasActorWebsiteDesignPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Actor website design for Las Vegas performers',
    serviceType: 'Website design for actors',
    provider: { '@id': `${siteConfig.origin}/#organization` },
    areaServed: {
      '@type': 'City',
      name: 'Las Vegas',
      containedInPlace: {
        '@type': 'State',
        name: 'Nevada',
      },
    },
    url: `${siteConfig.origin}/las-vegas-actor-website-design`,
    description: 'Done-for-you actor website design for performers in the Las Vegas market, delivered online.',
  };

  return (
    <div className="solta-site">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <SiteHeader />
      <main id="main">
        <section className="wrap sec" style={{ paddingTop: '72px' }}>
          <div style={{ maxWidth: '930px' }}>
            <div className="eyebrow">Las Vegas actor websites · Built online · $499 once</div>
            <h1>Actor website design for Las Vegas performers.</h1>
            <p className="lead">
              Your headshot, reel, resume, credits and professional contact information on your own domain.
              Solta Site builds the site for you online for $499 once.
            </p>
            <div className="ctas" style={{ paddingTop: '24px' }}>
              <Link className="btn" href="/start">Start your site · $499 <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/actor-website-examples">See actor website examples <span className="ar" aria-hidden="true">→</span></Link>
            </div>
            <div className="cap" style={{ paddingTop: '18px' }}>Serving Las Vegas actors online.</div>
          </div>
        </section>

        <section className="band">
          <div className="wrap sec">
            <div style={{ maxWidth: '960px' }}>
              <div className="cap">The Las Vegas market</div>
              <h2 style={{ paddingTop: '10px' }}>Las Vegas performers can work across more than one kind of stage or screen.</h2>
              <p className="lead">
                The local market is broader than one lane. Depending on the performer, that can mean film and television,
                commercials, independent or student productions, live entertainment, promotional work or digital content.
              </p>
              <p className="p">
                The website should make your actual professional lane obvious instead of turning every credit, clip and side
                project into one generic creative portfolio.
              </p>
              <div className="cols2" style={{ marginTop: '36px' }}>
                <div className="card pad">
                  <h3>Screen-focused actor</h3>
                  <p className="p">Lead with the current headshot and strongest reel or clip, then let selected credits and the résumé support the work.</p>
                </div>
                <div className="card pad">
                  <h3>Commercial or live performer</h3>
                  <p className="p">Keep the face and strongest on-camera or live material first, with a clear professional booking or representation route.</p>
                </div>
                <div className="card pad">
                  <h3>Stage and screen</h3>
                  <p className="p">Give theatre credits and training enough room without burying the reel or making the site read like a long program.</p>
                </div>
                <div className="card pad dark">
                  <h3>Still building credits</h3>
                  <p className="p">A smaller set of current, strong materials is better than padding the site with old or unrelated work just to make it feel full.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap sec">
          <div style={{ maxWidth: '940px' }}>
            <div className="cap">Las Vegas + another working market</div>
            <h2 style={{ paddingTop: '10px' }}>One site can show more than one market without looking scattered.</h2>
            <p className="lead">
              If you legitimately work in both Las Vegas and Los Angeles — or another market — you do not need to stuff every
              city beside your name. Keep one primary market near your identity and use supporting copy, credits or contact
              context for the second.
            </p>
            <p className="p">
              The headshot, reel and current work should still be more prominent than geography. The goal is to make your
              availability clear without turning the page into a list of city keywords.
            </p>
            <Link className="link" href="/actor-seo">See the SEO for actors guide <span className="ar" aria-hidden="true">→</span></Link>
          </div>
        </section>

        <section className="band">
          <div className="wrap sec">
            <div style={{ maxWidth: '940px' }}>
              <div className="cap">What belongs on the site</div>
              <h2 style={{ paddingTop: '10px' }}>The core material stays simple.</h2>
              <div className="cols2" style={{ marginTop: '32px' }}>
                <div className="card pad">
                  <h3>Current headshot</h3>
                  <p className="p">Make it easy to confirm who you are and how you look now.</p>
                </div>
                <div className="card pad">
                  <h3>Reel or strongest clips</h3>
                  <p className="p">Put the work close enough to the top that someone can play it without hunting through navigation.</p>
                </div>
                <div className="card pad">
                  <h3>Résumé and selected credits</h3>
                  <p className="p">Keep important credits scannable and make the full résumé easy to download.</p>
                </div>
                <div className="card pad">
                  <h3>Representation or safe contact</h3>
                  <p className="p">Use your rep when you have one, or a professional contact route when you do not.</p>
                </div>
              </div>
              <div style={{ paddingTop: '24px' }}>
                <Link className="link" href="/what-to-put-on-an-actor-website">See the full actor website checklist <span className="ar" aria-hidden="true">→</span></Link>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap sec">
          <div style={{ maxWidth: '980px' }}>
            <div className="cap">Las Vegas and Nevada actor resources</div>
            <h2 style={{ paddingTop: '10px' }}>Useful places to understand the local production and audition ecosystem.</h2>
            <p className="p">
              These are independent industry and training resources. Solta Site is not affiliated with or endorsed by them.
            </p>
            <div style={{ display: 'grid', gap: '18px', marginTop: '32px' }}>
              {resourceLinks.map((resource) => (
                <article className="card pad" key={resource.href}>
                  <h3><a href={resource.href}>{resource.name}</a></h3>
                  <p className="p">{resource.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="band">
          <div className="wrap sec">
            <div style={{ maxWidth: '960px' }}>
              <div className="cap">The Solta Site offer</div>
              <h2 style={{ paddingTop: '10px' }}>The website is still simple: your materials, organized around you.</h2>
              <div className="cols2" style={{ marginTop: '36px' }}>
                <div className="card pad dark">
                  <div className="cap">One-time</div>
                  <h3>$499</h3>
                  <p className="p">Hosting is included. There is no monthly Solta Site hosting fee.</p>
                </div>
                <div className="card pad">
                  <h3>Your own domain</h3>
                  <p className="p">Your professional address stays in your name. Already have a domain? We connect it.</p>
                </div>
                <div className="card pad">
                  <h3>Two rounds of changes</h3>
                  <p className="p">Review the direction before launch and consolidate your requested changes into two rounds.</p>
                </div>
                <div className="card pad">
                  <h3>Two updates a year included</h3>
                  <p className="p">New headshot, new reel or representation change can be handled without rebuilding the site from scratch.</p>
                </div>
              </div>
              <div className="ctas" style={{ paddingTop: '24px' }}>
                <Link className="link" href="/actor-website-design">See the full actor website design service <span className="ar" aria-hidden="true">→</span></Link>
                <Link className="link" href="/actor-website-cost">See the actor website cost breakdown <span className="ar" aria-hidden="true">→</span></Link>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap sec">
          <div style={{ maxWidth: '940px' }}>
            <div className="cap">Different performers, different visual directions</div>
            <h2 style={{ paddingTop: '10px' }}>The same materials do not have to look like the same template.</h2>
            <p className="lead">
              A cinematic screen actor, a brighter commercial performer and a stage-and-screen actor can all need the same
              basic information while benefiting from completely different visual systems.
            </p>
            <Link className="link" href="/actor-website-examples">Browse actor website examples <span className="ar" aria-hidden="true">→</span></Link>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div className="close">
            <div className="circ"></div>
            <div className="in">
              <h2>Build the professional link you can keep using.</h2>
              <p className="lead">Serving Las Vegas actors online. Built for you and live on your domain after review.</p>
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
