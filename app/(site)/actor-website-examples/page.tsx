import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '@/components/site-shell';
import { createPageMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = createPageMetadata({
  path: '/actor-website-examples',
  title: 'Actor Website Examples: 3 Styles That Put Your Work First | Solta Site',
  description: 'See three actor website examples for film, TV, commercial and theatre performers, plus what every actor site should include and how to choose a layout.',
  index: true,
});

const examples = [
  {
    name: 'Keshia Jean',
    label: 'Film and TV · seeking representation',
    image: '/assets/img/keshia-jean.jpg',
    alt: 'Actor website example with a dark cinematic layout',
    body: 'A cinematic direction that puts the reel and current headshot first, then gives agents a direct way to reach the actor.',
    href: null,
  },
  {
    name: 'Maya Ortiz',
    label: 'Comedy and commercial · represented',
    image: '/assets/img/maya-7.jpg',
    alt: 'Bright actor website example for a comedy and commercial performer',
    body: 'A bright, personality-led layout with the actor front and center, followed by reel, credits, headshots and representation.',
    href: '/examples/maya',
  },
  {
    name: 'Devon Hale',
    label: 'Stage and screen · represented',
    image: '/assets/img/devon-7.jpg',
    alt: 'Minimal actor website example for a stage and screen performer',
    body: 'A quieter editorial layout for a performer whose theatre and screen credits need room to breathe without hiding the reel.',
    href: '/examples/devon',
  },
];

export default function ActorWebsiteExamplesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Actor Website Examples',
    url: `${siteConfig.origin}/actor-website-examples`,
    description: 'Three actor website examples and practical guidance on what an actor portfolio website should include.',
    isPartOf: { '@id': `${siteConfig.origin}/#organization` },
  };

  return (
    <div className="solta-site">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <SiteHeader />
      <main id="main">
        <section className="wrap sec" style={{ paddingTop: '72px' }}>
          <div style={{ maxWidth: '860px' }}>
            <div className="eyebrow">Actor website examples</div>
            <h1>Three actor websites. Three completely different reads.</h1>
            <p className="lead">The best actor website is not the one with the most pages. It is the one that makes your current headshot, reel, resume, credits and contact information obvious in seconds.</p>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div className="examples">
            {examples.map((example) => (
              <article className="ex" key={example.name}>
                <div className="tile" style={{ overflow: 'hidden' }}>
                  <Image
                    src={example.image}
                    alt={example.alt}
                    width={1200}
                    height={1800}
                    sizes="(max-width: 860px) 90vw, 380px"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 18%' }}
                  />
                </div>
                <div>
                  <div className="cap">{example.label}</div>
                  <h2 style={{ fontSize: '34px', paddingTop: '8px' }}>{example.name}</h2>
                  <p className="p">{example.body}</p>
                  {example.href ? (
                    <Link className="link" href={example.href}>Open the example <span className="ar" aria-hidden="true">→</span></Link>
                  ) : siteConfig.keshiaUrl ? (
                    <a className="link" href={siteConfig.keshiaUrl}>Open the site <span className="ar" aria-hidden="true">→</span></a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="band">
          <div className="wrap sec">
            <div style={{ maxWidth: '900px' }}>
              <div className="cap">What every actor website needs</div>
              <h2 style={{ paddingTop: '10px' }}>Five things should be easy to find.</h2>
              <div className="cols2" style={{ marginTop: '36px' }}>
                <div className="card pad">
                  <h3>1. A current headshot</h3>
                  <p className="p">Lead with how you look now. Visitors should not have to click through a gallery to confirm they found the right person.</p>
                </div>
                <div className="card pad">
                  <h3>2. Your reel</h3>
                  <p className="p">Put the strongest reel or clip close to the top and make it playable without a scavenger hunt.</p>
                </div>
                <div className="card pad">
                  <h3>3. Resume and credits</h3>
                  <p className="p">Give people a fast on-page scan and a downloadable resume when they need the full version.</p>
                </div>
                <div className="card pad">
                  <h3>4. Representation or contact</h3>
                  <p className="p">List your rep when you have one. If you do not, give legitimate industry contacts a simple way to reach you.</p>
                </div>
                <div className="card pad">
                  <h3>5. Your own domain</h3>
                  <p className="p">A name-based domain gives you one stable link for casting profiles, email signatures, resumes and search results.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap sec">
          <div style={{ maxWidth: '900px' }}>
            <div className="cap">Choosing a direction</div>
            <h2 style={{ paddingTop: '10px' }}>Match the design to the work, not a template trend.</h2>
            <p className="lead">A dramatic film actor can use a darker cinematic page. A commercial performer can go brighter and more personality-forward. A theatre actor may need more space for credits and training. The structure can stay simple while the visual read changes completely.</p>
            <p className="p">That is how Solta Site works: you send the materials, we build the site around the performer, and it goes live on your domain. You do not spend a weekend learning a website builder.</p>
            <p className="p">Looking for the service itself? <Link href="/actor-website-design">See our actor website design service →</Link></p>
            <div className="ctas" style={{ paddingTop: '24px' }}>
              <Link className="btn" href="/start">Start your site · $499 <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/">See what is included <span className="ar" aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
