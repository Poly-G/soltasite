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
    text: 'Nevada’s official film office for productions, locations, crew and industry resources.',
  },
  {
    name: 'Nevada Production Directory',
    href: 'https://film.nv.gov/about-us/film-nevadas-directories/',
    text: 'A statewide directory for film professionals. Listings can include credits, a résumé, website and reel.',
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
    text: 'A local audition and casting site for Las Vegas performers.',
  },
];

const lanes = [
  ['01', 'Film + TV', 'Put the headshot and reel first. Then back it up with selected credits and the full résumé.'],
  ['02', 'Commercial', 'Keep the page quick. Face, clips, rep or contact info.'],
  ['03', 'Stage + screen', 'Make room for theatre and training without pushing the reel and contact info too far down.'],
  ['04', 'Building credits', 'You do not need to fill space. Use the best current material you have.'],
];

const essentials = [
  ['01', 'Current headshot', 'Use the headshot that looks like you now.'],
  ['02', 'Reel or strongest clip', 'Put it near the top so people do not have to hunt for it.'],
  ['03', 'Résumé + selected credits', 'Show the important credits on the page and keep the full résumé easy to download.'],
  ['04', 'Representation or contact', 'List your rep if you have one. If not, use a professional email or contact form.'],
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
              <div className="cap">Las Vegas actors do different kinds of work</div>
              <h2>Your site should make it clear what kind of actor you are.</h2>
              <p className="lead">
                Some actors are focused on film and TV. Others do commercial work, stage, live entertainment,
                independent productions or a mix. Your site should make that clear fast.
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
            <div className="cap">Working in Vegas and LA?</div>
            <h2>You can list both without making the site messy.</h2>
            <p className="lead">
              If you work in Las Vegas and Los Angeles, or another market, you can show both. Keep one market near
              your name and mention the second where it makes sense.
            </p>
            <p className="p">
              Your headshot and reel still come first. The cities only need to tell people where you work.
            </p>
            <Link className="link" href="/actor-seo">See the SEO for actors guide <span className="ar" aria-hidden="true">→</span></Link>
          </div>
        </section>

        <section className="band">
          <div className="wrap sec local-essentials">
            <div className="local-section-head compact">
              <div className="cap">What belongs on the site</div>
              <h2>Four things people should find fast.</h2>
              <p className="p">No matter what kind of work you do, these are the basics.</p>
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
            <h2>A few Las Vegas resources worth knowing.</h2>
            <p className="lead">Useful starting points for production, training and auditions in Nevada.</p>
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
            <h2>You send the materials. We build the site.</h2>
            <p className="lead">No website builder to learn. No template to wrestle with. We handle the design and build.</p>
            <div>
              <div className="item numrow"><span className="num">01</span><span>Hosting included. No monthly Solta Site hosting fee.</span></div>
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
            <p className="lead">Built from your material, not from a generic Vegas template.</p>
            <div className="cap note">Serving Las Vegas performers online.</div>
            <Link className="btn full" href="/start">Start your site · $499 <span className="ar" aria-hidden="true">→</span></Link>
            <Link className="link" href="/actor-website-examples">See what yours could look like <span className="ar" aria-hidden="true">→</span></Link>
          </div>
        </section>

        <section className="band">
          <div className="wrap sec local-proof">
            <div>
              <div className="cap">Different actors should look different</div>
              <h2>Vegas tells people where you work. It should not decide how your site looks.</h2>
            </div>
            <div className="local-proof-words" aria-hidden="true">
              <span>FILM + TV</span>
              <span>COMMERCIAL</span>
              <span>STAGE + SCREEN</span>
            </div>
            <div className="local-proof-footer">
              <p className="lead">The same basic information can look completely different from one actor to the next.</p>
              <Link className="link" href="/actor-website-examples">Browse actor website examples <span className="ar" aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: '72px' }}>
          <div className="close">
            <div className="circ"></div>
            <div className="in">
              <div className="cap">Las Vegas · Online</div>
              <h2>Give people one good link when they look you up.</h2>
              <p className="lead">Your headshot, reel, résumé and contact info. All in one place.</p>
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
