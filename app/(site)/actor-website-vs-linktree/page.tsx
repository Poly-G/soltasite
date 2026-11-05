import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '@/components/site-shell';
import { SourceList } from '@/components/source-list';
import { createPageMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = createPageMetadata({
  path: '/actor-website-vs-linktree',
  title: 'Actor Website vs Linktree: Which Do You Need? | Solta Site',
  description: 'Linktree is useful for routing people to several links. An actor website is better when you want your reel, headshots, credits, resume and contact in one professional destination.',
  index: true,
});

const rows = [
  ['Main job', 'Route visitors to other links', 'Present your acting materials in one place'],
  ['URL', 'linktr.ee/yourusername', 'Your own domain'],
  ['Reel and headshots', 'Usually linked or embedded as individual items', 'Can be built into the main experience'],
  ['Resume and credits', 'Usually another link to open', 'Can be visible on the page and downloadable'],
  ['Design control', 'Theme and profile customization', 'Full layout and visual direction'],
  ['Best traffic source', 'Social bio and quick sharing', 'Search, referrals, resumes, email signatures and direct sharing'],
];

export default function ActorWebsiteVsLinktreePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Actor Website vs Linktree: Which Do You Need?',
    description: 'A practical comparison of Linktree and a dedicated actor website for reels, headshots, resumes, credits and professional contact.',
    mainEntityOfPage: `${siteConfig.origin}/actor-website-vs-linktree`,
    publisher: { '@id': `${siteConfig.origin}/#organization` },
    datePublished: '2026-11-04',
    dateModified: '2026-11-04',
    citation: [
      'https://linktr.ee/help/articles/5434130-about-linktree',
      'https://linktr.ee/help/articles/6571689-about-custom-domains',
      'https://linktr.ee/help/articles/5434178-understanding-your-insights',
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
            <h1>Actor website vs Linktree: which one do you actually need?</h1>
            <p className="lead">They solve different problems. Linktree is a link-in-bio page: it gives people one URL that routes them to several places. An actor website is the destination itself, where your reel, headshots, resume, credits and professional contact can live together.</p>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div style={{ maxWidth: '900px' }}>
            <div className="card pad dark">
              <div className="cap">The short answer</div>
              <h2 style={{ paddingTop: '10px' }}>Use Linktree for routing. Use a website for presentation.</h2>
              <p className="p">If most people find you through Instagram or TikTok and you mainly need one place to send them to IMDb, Actors Access, your reel and your socials, Linktree can do that well. If you want one professional page someone can open after searching your name, reading your resume or getting referred to you, a dedicated actor website is the stronger fit.</p>
            </div>
          </div>
        </section>

        <section className="wrap sec">
          <div style={{ maxWidth: '1040px', overflowX: 'auto' }}>
            <div className="cap">Side by side</div>
            <h2 style={{ paddingTop: '10px' }}>The difference is not “simple page vs fancy page.” It is routing vs presenting.</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '760px', marginTop: '32px' }}>
              <thead>
                <tr>
                  {['', 'Linktree', 'Actor website'].map((heading) => (
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
              <div className="cap">When Linktree makes sense</div>
              <h2 style={{ paddingTop: '10px' }}>It is useful when the visitor already knows what they want to click.</h2>
              <div className="cols2" style={{ marginTop: '36px' }}>
                <div className="card pad">
                  <h3>Your traffic is mostly social</h3>
                  <p className="p">A link-in-bio page is built for the moment when someone taps your profile and needs quick routes to several destinations.</p>
                </div>
                <div className="card pad">
                  <h3>You have lots of separate destinations</h3>
                  <p className="p">If your main goal is sending people to IMDb, a casting profile, a current project, social accounts and another website, a compact link hub is convenient.</p>
                </div>
                <div className="card pad">
                  <h3>You want fast self-service changes</h3>
                  <p className="p">Linktree lets you reorder and update links without rebuilding a website, which is useful when the destinations change often.</p>
                </div>
                <div className="card pad">
                  <h3>You care about link-click analytics</h3>
                  <p className="p">Linktree includes Insights for views, clicks and traffic sources, with the amount of history and detail depending on the plan.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap sec">
          <div style={{ maxWidth: '940px' }}>
            <div className="cap">When an actor website makes more sense</div>
            <h2 style={{ paddingTop: '10px' }}>It is better when the visitor should understand you before clicking anywhere else.</h2>
            <div style={{ display: 'grid', gap: '22px', marginTop: '32px' }}>
              <div>
                <h3>You want your reel visible immediately</h3>
                <p className="p">A dedicated site can put your strongest clip next to your name and current headshot instead of making the visitor choose a separate reel link first.</p>
              </div>
              <div>
                <h3>You want one professional destination</h3>
                <p className="p">Someone can see your headshots, credits, resume, representation and contact information without bouncing through several services.</p>
              </div>
              <div>
                <h3>You want your own domain</h3>
                <p className="p">Linktree currently uses a linktr.ee username URL and does not support replacing it with a custom domain. A dedicated website can live directly at your name or professional domain.</p>
              </div>
              <div>
                <h3>You want the site to be part of what people find when they search your name</h3>
                <p className="p">A dedicated site gives search engines a page centered on you, with your name, materials and professional context in one crawlable destination.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="band">
          <div className="wrap sec">
            <div style={{ maxWidth: '940px' }}>
              <div className="cap">You can use both</div>
              <h2 style={{ paddingTop: '10px' }}>They do not have to compete.</h2>
              <p className="lead">A practical setup is to use your actor website as the main professional destination, then use Linktree when you need a social-specific menu of links. Your Linktree can point to the website, and the website can still link to IMDb, casting profiles and social accounts.</p>
              <p className="p">The important part is deciding which URL you want someone to remember after they meet you, see your work or search your name. For most actors with solid materials, that should usually be the domain you control.</p>
            </div>
          </div>
        </section>

        <section className="wrap sec">
          <div style={{ maxWidth: '900px' }}>
            <div className="cap">If you only build one</div>
            <h2 style={{ paddingTop: '10px' }}>Choose based on the job you need the page to do.</h2>
            <div className="cols2" style={{ marginTop: '36px' }}>
              <div className="card pad">
                <h3>Choose Linktree if...</h3>
                <p className="p">You mainly need a fast social bio hub, you are still building your acting materials, or your priority is routing visitors to several other platforms.</p>
              </div>
              <div className="card pad dark">
                <h3>Choose an actor website if...</h3>
                <p className="p">You already have headshots, footage, credits or training and want one page that presents you professionally without making the visitor assemble the picture themselves.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div style={{ maxWidth: '900px' }}>
            <div className="cap">Keep going</div>
            <h2 style={{ paddingTop: '10px' }}>Build the rest of the decision from here.</h2>
            <div className="ctas" style={{ paddingTop: '24px' }}>
              <Link className="link" href="/do-actors-need-a-website">Do actors need a website? <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/what-to-put-on-an-actor-website">Actor website checklist <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/actor-website-examples">Actor website examples <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/actor-website-builder">Builder vs done-for-you <span className="ar" aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        <SourceList reviewed="November 4, 2026" sources={[
          { name: 'Linktree: about Linktree', href: 'https://linktr.ee/help/articles/5434130-about-linktree', note: 'Linktree describes itself as a link-in-bio page for collecting links, content and profile destinations in one URL.' },
          { name: 'Linktree: custom domains', href: 'https://linktr.ee/help/articles/6571689-about-custom-domains', note: 'Linktree states that profiles use linktr.ee URLs and that custom domains are not supported.' },
          { name: 'Linktree: Insights', href: 'https://linktr.ee/help/articles/5434178-understanding-your-insights', note: 'Linktree documents profile views, link clicks, traffic sources and plan-dependent analytics history.' },
        ]} />

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div className="close">
            <div className="circ"></div>
            <div className="in">
              <h2>Want the professional destination without building it yourself?</h2>
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
