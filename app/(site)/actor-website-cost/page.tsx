import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '@/components/site-shell';
import { createPageMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = createPageMetadata({
  path: '/actor-website-cost',
  title: 'How Much Does an Actor Website Cost? | Solta Site',
  description: 'Actor website costs range from DIY monthly subscriptions to custom design fees. See what you actually pay for, what to avoid, and how Solta Site compares at $499 once.',
  index: true,
});

const rows = [
  ['DIY website builder', 'Lower upfront cost', 'You build and maintain it yourself', 'Usually recurring'],
  ['Done-for-you custom designer', 'Higher upfront cost', 'Designer builds it for you', 'Often hosting or maintenance too'],
  ['Solta Site', '$499 once', 'Built for you in 5 business days', 'No monthly hosting fee'],
];

export default function ActorWebsiteCostPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'How Much Does an Actor Website Cost?',
    url: `${siteConfig.origin}/actor-website-cost`,
    description: 'A practical guide to actor website costs, recurring fees and what performers should expect to pay.',
    isPartOf: { '@id': `${siteConfig.origin}/#organization` },
    about: { '@id': `${siteConfig.origin}/#service` },
  };

  return (
    <div className="solta-site">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <SiteHeader />
      <main id="main">
        <section className="wrap sec" style={{ paddingTop: '72px' }}>
          <div style={{ maxWidth: '900px' }}>
            <div className="eyebrow">Actor website cost</div>
            <h1>How much does an actor website cost?</h1>
            <p className="lead">There is no single price. The real question is whether you want to build it yourself, hire someone to build it, or pay for a done-for-you actor site without an ongoing website subscription.</p>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div style={{ maxWidth: '980px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '680px' }}>
              <thead>
                <tr>
                  {['Option', 'Upfront cost', 'Your time', 'Ongoing cost'].map((heading) => (
                    <th key={heading} style={{ textAlign: 'left', padding: '16px 14px', borderBottom: '1px solid var(--line)' }}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell) => <td key={cell} style={{ padding: '18px 14px', borderBottom: '1px solid var(--line)', verticalAlign: 'top' }}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="band">
          <div className="wrap sec">
            <div style={{ maxWidth: '900px' }}>
              <div className="cap">The three common ways to pay</div>
              <h2 style={{ paddingTop: '10px' }}>What changes the price?</h2>
              <div className="cols2" style={{ marginTop: '36px' }}>
                <div className="card pad">
                  <h3>DIY website builders</h3>
                  <p className="p">The cash cost can look low because you pay by the month or year. The tradeoff is your time: choosing a template, laying out pages, resizing photos, embedding your reel, connecting a domain and keeping everything current.</p>
                </div>
                <div className="card pad">
                  <h3>Custom web designers</h3>
                  <p className="p">A designer can create something more tailored, but custom projects usually cost more upfront. Depending on the provider, hosting, maintenance, edits and additional pages may be separate charges.</p>
                </div>
                <div className="card pad">
                  <h3>Done-for-you actor websites</h3>
                  <p className="p">This sits between the two: a site built around the materials actors actually use, without paying for a full custom-agency engagement or spending your own weekend inside a site builder.</p>
                </div>
                <div className="card pad dark">
                  <div className="cap">Solta Site</div>
                  <h3>$499, once.</h3>
                  <p className="p">We build the actor website for you. Hosting is included, there is no monthly hosting fee, and two updates a year are included. Your domain renews separately in your name.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap sec">
          <div style={{ maxWidth: '900px' }}>
            <div className="cap">What should be included</div>
            <h2 style={{ paddingTop: '10px' }}>An actor website should not become a second job.</h2>
            <p className="lead">For most actors, the site only needs to make the important material easy to find: your current headshot, reel, resume, credits and training, representation or contact route, and the links casting already uses.</p>
            <div className="cols2" style={{ marginTop: '36px' }}>
              <div>
                <h3>Before you compare prices, check:</h3>
                <ul className="p" style={{ paddingLeft: '20px', display: 'grid', gap: '10px' }}>
                  <li>Is hosting included or billed separately?</li>
                  <li>Do you own the domain?</li>
                  <li>Can you update headshots and reels later?</li>
                  <li>Is mobile design included?</li>
                  <li>Are there extra charges for pages, photos or video embeds?</li>
                  <li>Who maintains the site after launch?</li>
                </ul>
              </div>
              <div>
                <h3>With Solta Site:</h3>
                <ul className="p" style={{ paddingLeft: '20px', display: 'grid', gap: '10px' }}>
                  <li>$499 one-time build</li>
                  <li>Hosting included</li>
                  <li>No monthly hosting fee</li>
                  <li>Your domain is in your name</li>
                  <li>Two rounds of changes before launch</li>
                  <li>Two updates a year included</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div className="close">
            <div className="circ"></div>
            <div className="in">
              <h2>Want the site without learning a website builder?</h2>
              <p className="lead">Send us your materials. We build it around you and put it live on your domain.</p>
              <p className="p">Want the full service details first? <Link href="/actor-website-design">See our actor website design service →</Link></p>
              <div className="ctas">
                <Link className="btn" href="/start">Start your site · $499 <span className="ar" aria-hidden="true">→</span></Link>
                <Link className="link" href="/actor-website-examples">See actor website examples <span className="ar" aria-hidden="true">→</span></Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
