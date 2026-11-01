import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '@/components/site-shell';
import { createPageMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = createPageMetadata({
  path: '/actor-website-examples',
  title: 'Actor Website Examples: 3 Styles That Put Your Work First | Solta Site',
  description: 'See one real client actor website plus two fictional design examples, with practical notes on layout, reels, headshots, resumes and contact.',
  index: true,
});

const examples = [
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
    description: 'One real client actor website and two fictional design examples, plus practical guidance on what an actor portfolio website should include.',
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
            <article className="ex">
              <div className="tile">
                <div className="mini">
                  <div className="bar"><i></i><i></i><i></i><span>keshiajean.com</span></div>
                  <div className="shot" style={{ background: '#1C1412' }}>
                    <Image
                      src="/assets/img/keshia-sophia-jean-desktop-hero.jpg"
                      alt="Keshia Sophia Jean's finished actor website hero."
                      width={2880}
                      height={1800}
                      sizes="(max-width: 860px) 258px, 310px"
                      style={{ objectFit: 'cover', objectPosition: '50% 50%' }}
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="cap">Real client site · Seeking representation</div>
                <h2 style={{ fontSize: '34px', paddingTop: '8px' }}>Keshia Sophia Jean</h2>
                <p className="p">Actor · Independent film · Los Angeles and Las Vegas</p>
                <p className="p">Deep darkroom brown, a handwritten name treatment, reel up top, four headshot looks, full resume and contact for agents and casting.</p>
                <Link className="link" href="/examples/keshia-sophia-jean" target="_blank" rel="noopener noreferrer">View the site <span className="ar" aria-hidden="true">→</span></Link>
              </div>
            </article>
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
                  <Link className="link" href={example.href}>Open the example <span className="ar" aria-hidden="true">→</span></Link>
                </div>
              </article>
            ))}
          </div>
        </section>

                <section className="band">
          <div className="wrap sec">
            <div style={{ maxWidth: '900px' }}>
              <div className="cap">What these examples have in common</div>
              <h2 style={{ paddingTop: '10px' }}>Different visual directions. The same core job.</h2>
              <p className="lead">Each example makes the actor easy to recognize, puts the reel or work near the top, and gives a clear route to credits and professional contact information. The visual system changes around the performer; the essentials do not.</p>
              <Link className="link" href="/what-to-put-on-an-actor-website">See the full actor website checklist <span className="ar" aria-hidden="true">→</span></Link>
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
