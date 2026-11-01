import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '@/components/site-shell';
import { createPageMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';
import { SourceList } from '@/components/source-list';

export const metadata: Metadata = createPageMetadata({
  path: '/do-actors-need-a-website',
  title: 'Do Actors Need a Website? When It Helps — and When It Can Wait | Solta Site',
  description: 'Actors do not strictly need a website to get work, but a personal site can give casting, agents and collaborators one place you control. Here is when it is worth building one.',
  index: true,
});

export default function DoActorsNeedAWebsitePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Do Actors Need a Website?',
    description: 'When an actor website is useful, when it can wait, and what it should do once you have one.',
    mainEntityOfPage: `${siteConfig.origin}/do-actors-need-a-website`,
    publisher: { '@id': `${siteConfig.origin}/#organization` },
    datePublished: '2026-10-31',
    dateModified: '2026-11-01',
    citation: ["https://actorsaccess.com/","https://support.castingnetworks.com/en/articles/11240193","https://help.imdb.com/article/imdbpro/membership-benefits/pro-tips-for-talent/GHQ5W5C2BJ2KWP77"],
  };

  return (
    <div className="solta-site">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <SiteHeader />
      <main id="main">
        <section className="wrap sec" style={{ paddingTop: '72px' }}>
          <div style={{ maxWidth: '900px' }}>
            <div className="eyebrow">Actor website guide</div>
            <h1>Do actors need a website?</h1>
            <p className="lead">Not strictly. You can get auditions, representation and bookings without one. But once you have solid materials, a personal website gives people one page about you that you control.</p>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div style={{ maxWidth: '900px' }}>
            <div className="card pad dark">
              <div className="cap">The short answer</div>
              <h2 style={{ paddingTop: '10px' }}>Casting profiles first. Your own site second.</h2>
              <p className="p">Your casting profiles are where submissions happen. A personal website does not replace Actors Access, Casting Networks, IMDb or your representation. Its job is different: when someone searches your name, follows a link from your resume or wants to see everything in one place, your site gives them a clean version of your work in the order you choose.</p>
            </div>
          </div>
        </section>

        <section className="band">
          <div className="wrap sec">
            <div style={{ maxWidth: '980px' }}>
              <div className="cap">When it is worth having one</div>
              <h2 style={{ paddingTop: '10px' }}>A website starts making sense when you have something useful to show.</h2>
              <div className="cols2" style={{ marginTop: '36px' }}>
                <div className="card pad">
                  <h3>You have professional headshots</h3>
                  <p className="p">If your photos accurately represent you now, a site gives them a permanent home under your own name.</p>
                </div>
                <div className="card pad">
                  <h3>You have footage</h3>
                  <p className="p">A reel, strong clip or polished scene gives visitors a fast way to see your work without hunting through social feeds.</p>
                </div>
                <div className="card pad">
                  <h3>You have credits or training</h3>
                  <p className="p">Even a modest resume becomes more useful when it sits next to your headshot, reel and professional contact information.</p>
                </div>
                <div className="card pad">
                  <h3>People are starting to look you up</h3>
                  <p className="p">After auditions, referrals, networking or meetings, a name-based site gives searchers something intentional to find.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap sec">
          <div style={{ maxWidth: '900px' }}>
            <div className="cap">When it can wait</div>
            <h2 style={{ paddingTop: '10px' }}>Do not build a website before the materials are ready.</h2>
            <p className="lead">If you are brand new and do not yet have a strong headshot, usable footage or a resume you are comfortable sharing, your money and attention may be better spent on those first. A nearly empty website does not create credibility just because it has a custom domain.</p>
            <p className="p">A complete casting profile with good materials is more important than owning a website too early. Add the site when it helps organize and strengthen what already exists.</p>
          </div>
        </section>

                <section className="band">
          <div className="wrap sec">
            <div style={{ maxWidth: '940px' }}>
              <div className="cap">How it fits with the tools you already use</div>
              <h2 style={{ paddingTop: '10px' }}>A website complements casting profiles and social media. It does not replace them.</h2>
              <div className="cols2" style={{ marginTop: '36px' }}>
                <div className="card pad">
                  <h3>Casting profiles</h3>
                  <p className="p">Keep them. Actors Access, Casting Networks and similar platforms are built for submissions and industry workflow. Your website has a different job: giving someone one professional page after they search your name or follow your link.</p>
                </div>
                <div className="card pad">
                  <h3>Instagram</h3>
                  <p className="p">Instagram is useful for personality, community and recent work. A website is cleaner when someone wants your reel, resume, credits and professional contact information without sorting through a social feed.</p>
                </div>
                <div className="card pad">
                  <h3>Linktree or another link-in-bio page</h3>
                  <p className="p">A link-in-bio page is good at routing people to several destinations. An actor website presents the important material itself, while still linking out to the profiles and platforms you use.</p>
                </div>
                <div className="card pad dark">
                  <h3>Your own website</h3>
                  <p className="p">The advantage is control: your name on the domain, your materials in the order you choose, and one address you can keep even when platforms change.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap sec">
          <div style={{ maxWidth: '900px' }}>
            <div className="cap">What it will not do</div>
            <h2 style={{ paddingTop: '10px' }}>A website is a marketing tool, not an audition machine.</h2>
            <p className="lead">Owning a website does not guarantee auditions, representation or bookings. It works best as part of the larger package: good materials, active casting profiles, relationships, training and strong work.</p>
            <p className="p">The value is that when somebody does become curious about you, you are not leaving the first impression entirely to search engines, old cast lists or a personal social account.</p>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div style={{ maxWidth: '900px' }}>
            <div className="cap">If you are ready</div>
            <h2 style={{ paddingTop: '10px' }}>Keep it simple and useful.</h2>
            <p className="p">Start with a current headshot, your strongest reel or clip, resume and credits, representation or a safe contact route, and the professional links that matter. You can see the full checklist and three different design directions below.</p>
            <p className="p">Want to improve what appears when someone searches your name? <Link href="/actor-seo">Read the SEO for actors guide →</Link></p>
            <div className="ctas" style={{ paddingTop: '24px' }}>
              <Link className="link" href="/what-to-put-on-an-actor-website">Actor website checklist <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/actor-website-examples">Actor website examples <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/actor-website-cost">Actor website cost <span className="ar" aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        <SourceList reviewed="November 1, 2026" sources={[
          { name: 'Actors Access', href: 'https://actorsaccess.com/', note: 'Actor profiles include headshots, résumé and performance media.' },
          { name: 'Casting Networks: viewing a talent profile', href: 'https://support.castingnetworks.com/en/articles/11240193', note: 'Casting users can review photos, credits, reels and other profile assets.' },
          { name: 'IMDbPro: pro tips for talent', href: 'https://help.imdb.com/article/imdbpro/membership-benefits/pro-tips-for-talent/GHQ5W5C2BJ2KWP77', note: 'IMDbPro describes profile sharing, résumé information and professional visibility.' },
        ]} />
        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div className="close">
            <div className="circ"></div>
            <div className="in">
              <h2>Ready for a site, but not interested in becoming a web designer?</h2>
              <p className="lead">Send us your materials. Solta Site builds the actor website for you and puts it live on your domain for $499 once.</p>
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
