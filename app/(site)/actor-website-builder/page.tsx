import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '@/components/site-shell';
import { createPageMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = createPageMetadata({
  path: '/actor-website-builder',
  title: 'Actor Website Builder vs Done-for-You Design | Solta Site',
  description: 'Comparing actor website builders? See what DIY builders handle, what they still leave to you, and when a done-for-you actor website makes more sense.',
  index: true,
});

const rows = [
  ['DIY actor website builder', 'You choose and edit the site yourself', 'Usually monthly or annual', 'Best if you want hands-on control'],
  ['General website builder', 'You adapt a broader template system', 'Usually monthly or annual', 'Best if your site also needs business features'],
  ['Done-for-you actor website', 'A designer builds around your materials', 'One-time or project fee', 'Best if you want the site without building it yourself'],
];

export default function ActorWebsiteBuilderPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Actor Website Builder vs Done-for-You Design',
    description: 'A practical comparison of actor website builders, general website builders and done-for-you actor website design.',
    mainEntityOfPage: `${siteConfig.origin}/actor-website-builder`,
    publisher: { '@id': `${siteConfig.origin}/#organization` },
  };

  return (
    <div className="solta-site">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <SiteHeader />
      <main id="main">
        <section className="wrap sec" style={{ paddingTop: '72px' }}>
          <div style={{ maxWidth: '930px' }}>
            <div className="eyebrow">Actor website builder guide</div>
            <h1>Do you need an actor website builder — or someone to build it for you?</h1>
            <p className="lead">Actor website builders can get you online quickly. The tradeoff is that you still make the layout, styling, content and maintenance decisions yourself. Solta Site is for actors who want the finished site without becoming the website builder.</p>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div style={{ maxWidth: '1000px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '760px' }}>
              <thead>
                <tr>
                  {['Option', 'Who builds it', 'Typical payment model', 'Best fit'].map((heading) => (
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
            <div style={{ maxWidth: '940px' }}>
              <div className="cap">What actor website builders do well</div>
              <h2 style={{ paddingTop: '10px' }}>They make the technical starting point easier.</h2>
              <div className="cols2" style={{ marginTop: '36px' }}>
                <div className="card pad">
                  <h3>Templates and sections</h3>
                  <p className="p">A builder can give you a structure for headshots, reels, credits, resumes and contact information without writing code.</p>
                </div>
                <div className="card pad">
                  <h3>Fast publishing</h3>
                  <p className="p">Many specialized tools can publish a basic actor site quickly, sometimes using imported credits or prebuilt performer layouts.</p>
                </div>
                <div className="card pad">
                  <h3>Self-service updates</h3>
                  <p className="p">If you enjoy managing your own site, a builder gives you direct control when a headshot, reel or credit changes.</p>
                </div>
                <div className="card pad">
                  <h3>Lower starting price</h3>
                  <p className="p">Subscription builders often cost less upfront than hiring someone, especially if you are comfortable doing the design work yourself.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap sec">
          <div style={{ maxWidth: '940px' }}>
            <div className="cap">What a builder still leaves to you</div>
            <h2 style={{ paddingTop: '10px' }}>The software can provide the editor. You still make the website.</h2>
            <div style={{ display: 'grid', gap: '22px', marginTop: '32px' }}>
              <div>
                <h3>Choosing the visual direction</h3>
                <p className="p">You decide which template, fonts, spacing, image crops and page structure actually fit your type and materials.</p>
              </div>
              <div>
                <h3>Prioritizing the content</h3>
                <p className="p">You decide what goes above the fold, where the reel lives, which credits matter and how much biography is enough.</p>
              </div>
              <div>
                <h3>Testing mobile layouts</h3>
                <p className="p">A template can be responsive and still need judgment. Headshots, text, embeds and buttons all need to read well on a small screen.</p>
              </div>
              <div>
                <h3>Keeping the subscription and site current</h3>
                <p className="p">Most builders are ongoing services, so the site stays live while the plan stays active and you continue managing the content.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="band">
          <div className="wrap sec">
            <div style={{ maxWidth: '960px' }}>
              <div className="cap">When a builder makes sense</div>
              <h2 style={{ paddingTop: '10px' }}>DIY is a good choice when you actually want DIY.</h2>
              <div className="cols2" style={{ marginTop: '36px' }}>
                <div className="card pad">
                  <h3>Choose a builder if...</h3>
                  <p className="p">You like making design decisions, want to edit everything yourself, need extra business features, or would rather trade your time for a lower upfront cost.</p>
                </div>
                <div className="card pad dark">
                  <h3>Choose done-for-you if...</h3>
                  <p className="p">You want to send your materials, review a finished direction and get the site live without learning an editor or building every section yourself.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap sec">
          <div style={{ maxWidth: '940px' }}>
            <div className="cap">The Solta Site approach</div>
            <h2 style={{ paddingTop: '10px' }}>You are not buying access to a builder.</h2>
            <p className="lead">You are buying the finished actor website. We take your headshots, reel, resume, credits and contact information, design the site around the performer, connect it to your domain and get it live.</p>
            <div className="cols2" style={{ marginTop: '36px' }}>
              <div className="card pad dark">
                <div className="cap">One-time</div>
                <h3>$499</h3>
                <p className="p">Hosting is included. There is no monthly hosting fee from Solta Site.</p>
              </div>
              <div className="card pad">
                <h3>5 business days</h3>
                <p className="p">Once we have the materials, the site is built, reviewed through two consolidated rounds of changes and prepared for your domain.</p>
              </div>
              <div className="card pad">
                <h3>Two updates a year included</h3>
                <p className="p">You do not need to learn a page editor just because you get a new headshot or change representation.</p>
              </div>
              <div className="card pad">
                <h3>Your domain</h3>
                <p className="p">The professional address stays in your name instead of being tied to a temporary platform URL.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div style={{ maxWidth: '900px' }}>
            <div className="cap">Compare the next step</div>
            <h2 style={{ paddingTop: '10px' }}>Want to see what the finished version can look like?</h2>
            <div className="ctas" style={{ paddingTop: '24px' }}>
              <Link className="link" href="/actor-website-design">Actor website design service <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/actor-website-examples">Actor website examples <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/actor-website-cost">Actor website cost breakdown <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/what-to-put-on-an-actor-website">Actor website checklist <span className="ar" aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div className="close">
            <div className="circ"></div>
            <div className="in">
              <h2>Skip the builder. Get the site.</h2>
              <p className="lead">Solta Site builds your actor website for you for $499 once.</p>
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
