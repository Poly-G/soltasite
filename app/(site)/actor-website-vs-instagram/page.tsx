import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '@/components/site-shell';
import { SourceList } from '@/components/source-list';
import { createPageMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = createPageMetadata({
  path: '/actor-website-vs-instagram',
  title: 'Actor Website vs Instagram: Do You Need Both? | Solta Site',
  description: 'Instagram is useful for discovery and ongoing activity. An actor website is better for presenting your reel, headshots, credits, resume and professional contact in one stable destination.',
  index: true,
});

const rows = [
  ['Main job', 'Ongoing social presence and discovery', 'Professional presentation and direct sharing'],
  ['Best content', 'Posts, clips, behind-the-scenes, updates', 'Headshots, reel, resume, credits, contact'],
  ['Navigation', 'Feed/profile structure controlled by the platform', 'Structure you control'],
  ['Search intent', 'Useful when someone already knows your handle', 'Useful when someone searches or receives your name/domain'],
  ['Longevity', 'Content moves through a feed', 'Core professional materials stay in fixed places'],
  ['Professional handoff', 'Good for keeping up with you', 'Better for sending one clean portfolio link'],
];

export default function ActorWebsiteVsInstagramPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Actor Website vs Instagram: Do You Need Both?',
    description: 'A practical comparison of Instagram and a dedicated actor website for discovery, reels, headshots, credits, resume and professional contact.',
    mainEntityOfPage: `${siteConfig.origin}/actor-website-vs-instagram`,
    publisher: { '@id': `${siteConfig.origin}/#organization` },
    author: { '@id': `${siteConfig.origin}/#organization` },
    image: `${siteConfig.origin}/opengraph-image`,
    datePublished: '2026-11-05',
    dateModified: '2026-11-05',
    citation: [
      'https://actorsaccess.com/',
      'https://actorsaccess.com/register/',
    ],
  };

  return (
    <div className="solta-site">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <SiteHeader />
      <main id="main">
        <section className="wrap sec" style={{ paddingTop: '72px' }}>
          <div style={{ maxWidth: '930px' }}>
            <div className="eyebrow">Actor website guide</div>
            <h1>Actor website vs Instagram: do you need both?</h1>
            <p className="lead">They do different jobs. Instagram is useful for visibility, personality and ongoing activity. A dedicated actor website is better when someone needs your professional materials in one stable place: current headshots, reel, credits, resume and contact.</p>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div className="card pad dark" style={{ maxWidth: '940px' }}>
            <div className="cap">The short answer</div>
            <h2 style={{ paddingTop: '10px' }}>Use social media to stay visible. Use your website to present the portfolio.</h2>
            <p className="p">Actors Access itself centers professional actor profiles around headshots, résumé and performance media. That is a good model for what your personal site should preserve, while Instagram can handle the more frequent, social side of your career.</p>
          </div>
        </section>

        <section className="wrap sec">
          <div style={{ maxWidth: '1040px', overflowX: 'auto' }}>
            <div className="cap">Side by side</div>
            <h2 style={{ paddingTop: '10px' }}>Social presence and professional portfolio are not the same thing.</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '780px', marginTop: '30px' }}>
              <thead>
                <tr>
                  {['', 'Instagram', 'Actor website'].map((heading) => (
                    <th key={heading || 'feature'} style={{ textAlign: 'left', padding: '16px 14px', borderBottom: '1px solid var(--line)' }}>{heading || 'Feature'}</th>
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
            <div style={{ maxWidth: '980px' }}>
              <div className="cap">When Instagram is useful</div>
              <h2 style={{ paddingTop: '10px' }}>It is good at showing that you are active and giving people more of your personality.</h2>
              <div className="cols2" style={{ marginTop: '34px' }}>
                <div className="card pad"><h3>Ongoing updates</h3><p className="p">Projects, rehearsal moments, press, festival news and professional milestones fit naturally into a social feed.</p></div>
                <div className="card pad"><h3>Short-form video</h3><p className="p">Clips can help people discover your work or get a quick sense of your personality and on-camera presence.</p></div>
                <div className="card pad"><h3>Relationships and visibility</h3><p className="p">Social platforms are built for following, sharing and interaction in a way a static portfolio is not.</p></div>
                <div className="card pad"><h3>Low-friction updates</h3><p className="p">Posting a new update is easier than editing a professional portfolio every time something small happens.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap sec">
          <div style={{ maxWidth: '980px' }}>
            <div className="cap">Where Instagram is weaker</div>
            <h2 style={{ paddingTop: '10px' }}>A feed is not an ideal place to make someone assemble your professional package.</h2>
            <div style={{ display: 'grid', gap: '20px', marginTop: '30px' }}>
              <div><h3>Your reel can get buried</h3><p className="p">A strong clip from months ago may sit far below newer posts, while a website can keep the reel in a fixed prominent position.</p></div>
              <div><h3>Your resume is not the center of the profile</h3><p className="p">Credits, training and a downloadable resume are easier to organize on a dedicated page.</p></div>
              <div><h3>The platform controls the experience</h3><p className="p">Your professional presentation lives inside someone else’s interface, navigation and product decisions.</p></div>
              <div><h3>It assumes the visitor wants social content</h3><p className="p">An agent, producer or collaborator may simply want the fastest route to your headshot, reel, credits and contact.</p></div>
            </div>
          </div>
        </section>

        <section className="band">
          <div className="wrap sec">
            <div style={{ maxWidth: '940px' }}>
              <div className="cap">The strongest setup</div>
              <h2 style={{ paddingTop: '10px' }}>Let each platform do the job it is good at.</h2>
              <p className="lead">Use your website as the professional home base. Put that domain on your resume, email signature and casting profiles where appropriate. Use Instagram to keep the public-facing story active, then point people back to the professional site when they need the full package.</p>
              <div className="ctas" style={{ paddingTop: '24px' }}>
                <Link className="link" href="/actor-website-vs-linktree">Compare actor website vs Linktree <span className="ar" aria-hidden="true">→</span></Link>
                <Link className="link" href="/acting-portfolio-website">Build an acting portfolio website <span className="ar" aria-hidden="true">→</span></Link>
                <Link className="link" href="/what-casting-directors-need-from-actor-website">See what casting needs to find quickly <span className="ar" aria-hidden="true">→</span></Link>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap sec">
          <div style={{ maxWidth: '940px' }}>
            <div className="cap">If you only maintain one professional destination</div>
            <h2 style={{ paddingTop: '10px' }}>Make it the place where your materials stay organized.</h2>
            <p className="lead">Social platforms are useful, but your most important acting materials should not depend on a visitor scrolling through a feed to find them. A dedicated website gives those materials a stable address under your own name.</p>
            <div className="ctas" style={{ paddingTop: '24px' }}>
              <Link className="link" href="/actor-website-examples">See actor website examples <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/what-to-put-on-an-actor-website">Use the actor website checklist <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/actor-seo">See the SEO for actors guide <span className="ar" aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        <SourceList reviewed="November 5, 2026" sources={[
          { name: 'Actors Access', href: 'https://actorsaccess.com/', note: 'Actors Access describes the professional actor profile around headshots, résumé and performance media.' },
          { name: 'Actors Access registration overview', href: 'https://actorsaccess.com/register/', note: 'Actors Access says the professional profile is the profile casting sees when reviewing submissions and includes headshots, résumé and professional details.' },
        ]} />

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div className="close">
            <div className="circ"></div>
            <div className="in">
              <h2>Want a professional home base outside the feed?</h2>
              <p className="lead">Solta Site builds your actor website around your headshots, reel, resume, credits and contact, puts it on your domain and includes hosting for $499 once.</p>
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
