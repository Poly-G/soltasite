import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '@/components/site-shell';
import { createPageMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = createPageMetadata({
  path: '/actor-website-vs-instagram-linktree-casting-profile',
  title: 'Actor Website vs Instagram, Linktree and Casting Profiles | Solta Site',
  description: 'Casting profiles, Instagram, Linktree and personal actor websites all do different jobs. See what each is best for and when an actor website adds value.',
  index: true,
});

const rows = [
  ['Casting profile', 'Submitting for work and being found inside casting platforms', 'Platform controls the layout and search result'],
  ['Instagram', 'Personality, audience building and social proof', 'Your acting materials compete with everything else you post'],
  ['Linktree or link-in-bio page', 'Putting several links in one place', 'It points elsewhere instead of presenting your work itself'],
  ['Personal actor website', 'Giving people one professional page you control', 'You still need casting profiles and other platforms'],
];

export default function ActorWebsiteComparisonPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Actor Website vs Instagram, Linktree and Casting Profiles',
    description: 'A practical comparison of actor websites, casting profiles, Instagram and link-in-bio pages.',
    mainEntityOfPage: `${siteConfig.origin}/actor-website-vs-instagram-linktree-casting-profile`,
    publisher: { '@id': `${siteConfig.origin}/#organization` },
  };

  return (
    <div className="solta-site">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <SiteHeader />
      <main id="main">
        <section className="wrap sec" style={{ paddingTop: '72px' }}>
          <div style={{ maxWidth: '920px' }}>
            <div className="eyebrow">Actor website comparison</div>
            <h1>Actor website vs Instagram, Linktree and casting profiles</h1>
            <p className="lead">You usually do not need to choose just one. Each tool solves a different problem. The useful question is what you want someone to see after they search your name or click your link.</p>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div style={{ maxWidth: '1000px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '760px' }}>
              <thead>
                <tr>
                  {['Tool', 'Best for', 'Main limitation'].map((heading) => (
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
              <div className="cap">Casting profiles</div>
              <h2 style={{ paddingTop: '10px' }}>Keep them. They do a job your website does not.</h2>
              <p className="lead">Actors Access, Casting Networks and similar platforms are built for submissions, breakdowns and industry workflow. A personal website should not try to replace them.</p>
              <p className="p">The website becomes useful outside that platform: when someone receives your name in an email, sees you on a call sheet, gets a referral, searches you after a callback or wants one clean page with your current materials.</p>
            </div>
          </div>
        </section>

        <section className="wrap sec">
          <div style={{ maxWidth: '940px' }}>
            <div className="cap">Instagram</div>
            <h2 style={{ paddingTop: '10px' }}>Great for personality. Less predictable as a portfolio.</h2>
            <div className="cols2" style={{ marginTop: '32px' }}>
              <div className="card pad">
                <h3>What Instagram does well</h3>
                <p className="p">It can show personality, recent work, collaborators, behind-the-scenes moments and whether you are actively creating.</p>
              </div>
              <div className="card pad">
                <h3>Where a website is cleaner</h3>
                <p className="p">Your reel, resume and contact information are not mixed between vacation photos, memes, personal posts and whatever the algorithm decides to surface.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="band">
          <div className="wrap sec">
            <div style={{ maxWidth: '940px' }}>
              <div className="cap">Linktree and link-in-bio pages</div>
              <h2 style={{ paddingTop: '10px' }}>Useful shortcut. Different purpose.</h2>
              <p className="lead">A link-in-bio page is good at routing people somewhere else. It is essentially a menu of links.</p>
              <p className="p">That can be perfect when the goal is “choose where you want to go.” An actor website is better when the goal is “here is the actor, here is the reel, here is the resume, and here is how to reach them” without another round of decisions.</p>
            </div>
          </div>
        </section>

        <section className="wrap sec">
          <div style={{ maxWidth: '940px' }}>
            <div className="cap">Your own website</div>
            <h2 style={{ paddingTop: '10px' }}>The advantage is control, not exclusivity.</h2>
            <div style={{ display: 'grid', gap: '22px', marginTop: '32px' }}>
              <div>
                <h3>Your name is the address</h3>
                <p className="p">A personal domain can become the stable link you keep using even when social platforms and casting tools change.</p>
              </div>
              <div>
                <h3>You choose the first impression</h3>
                <p className="p">Put the headshot, reel and credits in the order that best represents you rather than accepting a platform's default layout.</p>
              </div>
              <div>
                <h3>You can still link everything else</h3>
                <p className="p">The site can point to IMDb, casting profiles, Instagram, TikTok, YouTube or whatever else is useful. It does not need to isolate you from those tools.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div style={{ maxWidth: '940px' }}>
            <div className="cap">A practical setup</div>
            <h2 style={{ paddingTop: '10px' }}>Use each tool for what it is good at.</h2>
            <div className="cols2" style={{ marginTop: '32px' }}>
              <div className="card pad dark">
                <h3>Casting profile</h3>
                <p className="p">For submissions and industry workflow.</p>
              </div>
              <div className="card pad">
                <h3>Instagram</h3>
                <p className="p">For personality, community and social presence.</p>
              </div>
              <div className="card pad">
                <h3>Link-in-bio page</h3>
                <p className="p">For routing people to several destinations when that is the goal.</p>
              </div>
              <div className="card pad">
                <h3>Your website</h3>
                <p className="p">For the professional version of you that comes up under your own name.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div style={{ maxWidth: '900px' }}>
            <div className="cap">Keep exploring</div>
            <h2 style={{ paddingTop: '10px' }}>Deciding whether a site makes sense?</h2>
            <div className="ctas" style={{ paddingTop: '24px' }}>
              <Link className="link" href="/do-actors-need-a-website">Do actors need a website? <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/what-to-put-on-an-actor-website">What should an actor website include? <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/actor-website-examples">See actor website examples <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/actor-website-cost">See actor website costs <span className="ar" aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div className="close">
            <div className="circ"></div>
            <div className="in">
              <h2>Want one professional link with your name on it?</h2>
              <p className="lead">Solta Site builds the actor website for you, puts it on your own domain, and includes hosting for $499 once.</p>
              <div className="ctas">
                <Link className="btn" href="/start">Start your site · $499 <span className="ar" aria-hidden="true">→</span></Link>
                <Link className="link" href="/">See what is included <span className="ar" aria-hidden="true">→</span></Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
