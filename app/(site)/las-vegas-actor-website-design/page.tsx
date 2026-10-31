import type { Metadata } from 'next';
import Image from 'next/image';
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
    text: 'Nevada’s official film office for production, locations, crew and industry resources.',
  },
  {
    name: 'Nevada Production Directory',
    href: 'https://film.nv.gov/about-us/film-nevadas-directories/',
    text: 'A statewide industry directory where approved listings can include credits, résumé, website and reel.',
  },
  {
    name: 'UNLV Stage and Screen Acting',
    href: 'https://www.unlv.edu/theatre/stage-and-screen',
    text: 'Training for performers working across stage, film and television.',
  },
  {
    name: 'Nevada Conservatory Theatre auditions',
    href: 'https://callboard.sites.unlv.edu/auditions/',
    text: 'Current audition information for Nevada Conservatory Theatre productions.',
  },
  {
    name: 'VegasAuditions.com',
    href: 'https://www.vegasauditions.com/',
    text: 'A Las Vegas–focused audition and casting resource for local performers.',
  },
];

const lanes = [
  ['01', 'Film + TV', 'Headshot and reel first. Credits support the work instead of taking over the page.'],
  ['02', 'Commercial', 'A bright, immediate read with the face, clips and professional booking route easy to find.'],
  ['03', 'Stage + screen', 'Give theatre and training real room without burying the reel or contact information.'],
  ['04', 'Building credits', 'A smaller set of current material beats a padded portfolio full of old or unrelated work.'],
];

const essentials = [
  ['01', 'Current headshot', 'Make it easy to confirm who you are and how you look now.'],
  ['02', 'Reel or strongest clip', 'One clear play action near the top. No hunting through menus.'],
  ['03', 'Résumé + selected credits', 'Important work on the page, with the full résumé ready to download.'],
  ['04', 'Representation or safe contact', 'Your rep when you have one; a professional route when you do not.'],
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
      containedInPlace: { '@type': 'State', name: 'Nevada' },
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
        <section className="wrap local-hero">
          <div className="local-hero-copy">
            <div className="eyebrow a a1">Las Vegas actor websites · Built online · $499 once</div>
            <h1 className="a a2">Actor websites for <span className="mark">Las Vegas</span> performers.</h1>
            <p className="lead a a3">
              Your headshot, reel, résumé, credits and professional contact information on your own domain.
              We design and build the whole thing for you.
            </p>
            <div className="ctas a a4">
              <Link className="btn" href="/start">Start your site · $499 <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/actor-website-examples">See actor website examples <span className="ar" aria-hidden="true">→</span></Link>
            </div>
            <div className="cap a a5">Serving Las Vegas actors online · Live in 5 business days after we have your materials</div>
          </div>

          <div className="local-hero-art" aria-hidden="true">
            <div className="local-orbit"></div>
            <div className="local-portrait a a2">
              <Image
                src="/assets/img/keshia-jean.jpg"
                alt=""
                width={900}
                height={1348}
                sizes="(max-width: 860px) 82vw, 360px"
                priority
              />
              <div className="local-portrait-shade"></div>
              <div className="local-portrait-copy">
                <div className="local-name">Keshia Jean</div>
                <div className="local-portrait-market">Film + TV · Las Vegas / Los Angeles</div>
                <div className="local-reel">▶ Watch reel</div>
              </div>
            </div>
            <div className="local-float local-float-market a a4">LAS VEGAS ↔ LA</div>
            <div className="local-float local-float-link a a5">One link. Your name.</div>
          </div>
        </section>

        <section className="band">
          <div className="wrap sec local-market">
            <div className="local-section-head">
              <div className="cap">Built for the way Vegas actors actually work</div>
              <h2>The market is bigger than one lane.</h2>
              <p className="lead">
                Depending on the performer, Las Vegas can mean screen work, commercials, live entertainment,
                independent productions or a mix. Your site should make your lane obvious in seconds.
              </p>
            </div>
            <div className="local-lanes">
              {lanes.map(([number, title, text]) => (
                <article className="local-lane" key={number}>
                  <span className="num">{number}</span>
                  <h3>{title}</h3>
                  <p className="p">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="wrap sec local-dual">
          <div className="local-dual-visual" aria-hidden="true">
            <div className="local-dual-dot"></div>
            <div className="local-dual-city">LAS<br />VEGAS</div>
            <div className="local-dual-arrow">↔</div>
            <div className="local-dual-city la">LA</div>
          </div>
          <div className="local-dual-copy">
            <div className="cap">More than one working market?</div>
            <h2>Vegas + LA can live on one site without looking scattered.</h2>
            <p className="lead">
              If you legitimately work in Las Vegas and Los Angeles — or another market — keep one primary market near
              your identity and use the second where it adds useful context.
            </p>
            <p className="p">
              Your face and your work should still carry the page. Geography is there to clarify your availability,
              not turn the headline into a list of cities.
            </p>
            <Link className="link" href="/actor-seo">See the SEO for actors guide <span className="ar" aria-hidden="true">→</span></Link>
          </div>
        </section>

        <section className="band">
          <div className="wrap sec local-essentials">
            <div className="local-section-head compact">
              <div className="cap">What belongs on the site</div>
              <h2>Four things. Easy to find.</h2>
              <p className="p">The local market changes. The basic job of an actor site does not.</p>
            </div>
            <div className="local-essential-list">
              {essentials.map(([number, title, text]) => (
                <div className="local-essential" key={number}>
                  <span className="num">{number}</span>
                  <h3>{title}</h3>
                  <p className="p">{text}</p>
                </div>
              ))}
              <Link className="link local-essential-link" href="/what-to-put-on-an-actor-website">
                See the full actor website checklist <span className="ar" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="wrap sec local-resources">
          <div className="local-resource-intro">
            <div className="cap">Las Vegas + Nevada actor resources</div>
            <h2>Know the local ecosystem.</h2>
            <p className="lead">A few durable places to understand production, training and auditions around the market.</p>
            <p className="cap">Independent resources. Solta Site is not affiliated with or endorsed by them.</p>
          </div>
          <div className="local-resource-list">
            {resourceLinks.map((resource, index) => (
              <a className="local-resource-row" href={resource.href} key={resource.href}>
                <span className="num">{String(index + 1).padStart(2, '0')}</span>
                <span className="local-resource-text">
                  <strong>{resource.name}</strong>
                  <span>{resource.text}</span>
                </span>
                <span className="local-resource-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </section>

        <section className="wrap get local-offer">
          <div className="l">
            <div className="cap">The Solta Site offer</div>
            <h2>The website part should be the easy part.</h2>
            <p className="lead">You send the materials. We make the design decisions, build the site and get it ready for your domain.</p>
            <div>
              <div className="item numrow"><span className="num">01</span><span>Hosting included — no monthly Solta Site hosting fee</span></div>
              <div className="item numrow"><span className="num">02</span><span>Your own domain, in your name</span></div>
              <div className="item numrow"><span className="num">03</span><span>Two consolidated rounds of changes</span></div>
              <div className="item numrow"><span className="num">04</span><span>Two updates a year included</span></div>
              <div className="item numrow"><span className="num">05</span><span>Live in 5 business days after we have your materials</span></div>
            </div>
            <div className="ctas">
              <Link className="link" href="/actor-website-design">Full service details <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/actor-website-cost">Cost breakdown <span className="ar" aria-hidden="true">→</span></Link>
            </div>
          </div>
          <div className="card price">
            <div><span className="pill">One-time</span></div>
            <div className="disp">$499</div>
            <p className="lead">Built around your actual material — not a generic “Vegas actor” template.</p>
            <div className="cap note">Serving Las Vegas performers online.</div>
            <Link className="btn full" href="/start">Start your site · $499 <span className="ar" aria-hidden="true">→</span></Link>
            <Link className="link" href="/actor-website-examples">See what yours could look like <span className="ar" aria-hidden="true">→</span></Link>
          </div>
        </section>

        <section className="band">
          <div className="wrap sec local-proof">
            <div>
              <div className="cap">Not a city template</div>
              <h2>Your market gives context. Your work gives the site its look.</h2>
            </div>
            <div className="local-proof-words" aria-hidden="true">
              <span>FILM + TV</span>
              <span>COMMERCIAL</span>
              <span>STAGE + SCREEN</span>
            </div>
            <div className="local-proof-footer">
              <p className="lead">Different performers can need the same information and still deserve completely different visual systems.</p>
              <Link className="link" href="/actor-website-examples">Browse actor website examples <span className="ar" aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: '72px' }}>
          <div className="close">
            <div className="circ"></div>
            <div className="in">
              <div className="cap">Las Vegas · Online</div>
              <h2>Build the professional link you can keep using.</h2>
              <p className="lead">Your materials. Your name. One place to send people when they look you up.</p>
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
