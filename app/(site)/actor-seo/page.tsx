import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '@/components/site-shell';
import { createPageMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';
import { SourceList } from '@/components/source-list';

export const metadata: Metadata = createPageMetadata({
  path: '/actor-seo',
  title: 'SEO for Actors: How to Show Up When Someone Googles Your Name | Solta Site',
  description: 'A practical actor SEO guide: use your professional name consistently, set up your domain and metadata, connect Search Console, earn relevant links, and keep your site current.',
  index: true,
});

const checklist = [
  'Use your professional acting name in the page title and main heading.',
  'Use a name-based domain when possible.',
  'Add accurate context such as actor, market or specialty without keyword stuffing.',
  'Keep your headshot, reel, credits and representation current.',
  'Link to your site from casting profiles, IMDb, representation and professional bios where appropriate.',
  'Use a canonical URL, sitemap and structured data.',
  'Connect the domain to Google Search Console and submit important URLs.',
];

export default function ActorSeoPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'SEO for Actors: How to Show Up When Someone Googles Your Name',
    description: 'A practical guide to actor SEO and name-based search visibility.',
    mainEntityOfPage: `${siteConfig.origin}/actor-seo`,
    publisher: { '@id': `${siteConfig.origin}/#organization` },
    datePublished: '2026-10-31',
    dateModified: '2026-11-01',
    citation: ["https://developers.google.com/search/docs/essentials","https://developers.google.com/search/docs/appearance/ai-features","https://developers.google.com/search/docs/appearance/structured-data/organization","https://help.imdb.com/article/contribution/submission-guides/linking-to-imdb-on-external-sites/GJ6MHXQ7AHEMZL2Q"],
  };

  return (
    <div className="solta-site">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <SiteHeader />
      <main id="main">
        <section className="wrap sec" style={{ paddingTop: '72px' }}>
          <div style={{ maxWidth: '930px' }}>
            <div className="eyebrow">SEO for actors</div>
            <h1>How do actors show up when someone Googles their name?</h1>
            <p className="lead">Actor SEO is mostly about making it easy for search engines to understand one thing: this website is the official professional page for this performer.</p>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div className="card pad dark" style={{ maxWidth: '940px' }}>
            <div className="cap">The goal</div>
            <h2 style={{ paddingTop: '10px' }}>Rank for your own professional name first.</h2>
            <p className="p">You do not need to rank for broad phrases like “best actor in Los Angeles.” For an individual performer, the most useful search is usually your name plus enough context for Google to distinguish you from everyone else with a similar name.</p>
          </div>
        </section>

        <section className="band">
          <div className="wrap sec">
            <div style={{ maxWidth: '960px' }}>
              <div className="cap">1. Make your identity consistent</div>
              <h2 style={{ paddingTop: '10px' }}>Use the same professional name everywhere.</h2>
              <div className="cols2" style={{ marginTop: '36px' }}>
                <div className="card pad">
                  <h3>Page title and heading</h3>
                  <p className="p">Your full professional name should appear naturally in the page title and main heading, along with useful context such as “actor,” your market or specialty when it genuinely describes you.</p>
                </div>
                <div className="card pad">
                  <h3>Your domain</h3>
                  <p className="p">A domain based on your professional name gives search engines and people a strong identity signal and gives you one URL you can keep using over time.</p>
                </div>
                <div className="card pad">
                  <h3>Profiles and bios</h3>
                  <p className="p">Use the same spelling and professional name across your website, casting profiles, IMDb, representation pages and public professional bios.</p>
                </div>
                <div className="card pad">
                  <h3>Useful context</h3>
                  <p className="p">If your name is common, context such as “actor,” city, theatre, film, commercial or another accurate specialty can help distinguish the right person without repeating keywords unnaturally.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap sec">
          <div style={{ maxWidth: '940px' }}>
            <div className="cap">2. Give Google a complete page to understand</div>
            <h2 style={{ paddingTop: '10px' }}>Your site should say who you are, what you do and how to reach you.</h2>
            <p className="lead">A site made entirely of images gives search engines less context than a site with a clear name, role, credits, location or market, representation and useful text around the work.</p>
            <p className="p">That does not mean writing paragraphs full of keywords. It means the visible content should accurately describe the same performer the photos, reel and resume represent.</p>
            <div className="ctas" style={{ paddingTop: '24px' }}>
              <Link className="link" href="/what-to-put-on-an-actor-website">See what an actor website should include <span className="ar" aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        <section className="band">
          <div className="wrap sec">
            <div style={{ maxWidth: '940px' }}>
              <div className="cap">3. Connect the rest of your professional footprint</div>
              <h2 style={{ paddingTop: '10px' }}>Links help confirm that all of these pages are about the same person.</h2>
              <p className="lead">When appropriate, link your website from the profiles and professional pages you already use. The goal is consistency: the same name, the same domain and the same current professional information.</p>
              <div className="cols2" style={{ marginTop: '32px' }}>
                <div className="card pad">
                  <h3>Casting profiles</h3>
                  <p className="p">Add your site URL where the platform allows it so industry visitors and search engines can connect the profile to your official site.</p>
                </div>
                <div className="card pad">
                  <h3>IMDb and representation</h3>
                  <p className="p">Where you control or can request an official website link, use the same canonical domain.</p>
                </div>
                <div className="card pad">
                  <h3>Social profiles</h3>
                  <p className="p">Professional bios can point back to your site, while your site can link only the social accounts you are comfortable presenting professionally.</p>
                </div>
                <div className="card pad">
                  <h3>Press, theatres and collaborators</h3>
                  <p className="p">Legitimate mentions from productions, theatres, festivals or collaborators can naturally strengthen the web of pages associated with your professional name.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap sec">
          <div style={{ maxWidth: '940px' }}>
            <div className="cap">4. Handle the technical basics</div>
            <h2 style={{ paddingTop: '10px' }}>The technical SEO should be boring and correct.</h2>
            <div style={{ display: 'grid', gap: '20px', marginTop: '32px' }}>
              <div><h3>Unique title and description</h3><p className="p">Every important page should have a clear title, useful description and one canonical URL.</p></div>
              <div><h3>Sitemap and robots</h3><p className="p">Search engines should be able to discover the public pages you want indexed and avoid private or utility routes.</p></div>
              <div><h3>Structured data</h3><p className="p">Schema can help describe the organization, person or service represented by the visible page, as long as it matches what visitors actually see.</p></div>
              <div><h3>Mobile performance</h3><p className="p">A fast, usable mobile site helps both visitors and search engines. Large headshots and video embeds should not make the page painful to open.</p></div>
            </div>
          </div>
        </section>

        <section className="band">
          <div className="wrap sec">
            <div style={{ maxWidth: '940px' }}>
              <div className="cap">5. Use Google Search Console</div>
              <h2 style={{ paddingTop: '10px' }}>Publishing the site is the beginning, not proof that Google indexed it.</h2>
              <p className="lead">Google can discover public sites on its own, but Search Console lets you verify the domain, submit the sitemap, inspect important URLs and see whether Google is actually indexing them.</p>
              <p className="p">For a brand-new actor site, submit the sitemap and inspect the homepage first. Then check again after major changes such as a new domain, redesign or large content update.</p>
            </div>
          </div>
        </section>

        <section className="wrap sec">
          <div style={{ maxWidth: '940px' }}>
            <div className="cap">6. Keep the page current</div>
            <h2 style={{ paddingTop: '10px' }}>Old information weakens the result you worked to create.</h2>
            <p className="lead">Update the website when your headshots, reel, credits or representation change. Search visibility is only useful if the page someone finds still represents you accurately.</p>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div style={{ maxWidth: '920px' }}>
            <div className="cap">Actor SEO checklist</div>
            <h2 style={{ paddingTop: '10px' }}>Before you send people to the site:</h2>
            <ul className="p" style={{ paddingLeft: '20px', display: 'grid', gap: '10px', marginTop: '24px' }}>
              {checklist.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </section>

        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div style={{ maxWidth: '900px' }}>
            <div className="cap">Related guides</div>
            <div className="ctas" style={{ paddingTop: '24px' }}>
              <Link className="link" href="/do-actors-need-a-website">Do actors need a website? <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/actor-website-design">Actor website design <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/actor-website-examples">Actor website examples <span className="ar" aria-hidden="true">→</span></Link>
              <Link className="link" href="/actor-website-builder">Actor website builder vs done-for-you <span className="ar" aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        <SourceList reviewed="November 1, 2026" sources={[
          { name: 'Google Search Essentials', href: 'https://developers.google.com/search/docs/essentials', note: 'Google’s core guidance on crawlability, useful content, links and search eligibility.' },
          { name: 'Google: AI features and your website', href: 'https://developers.google.com/search/docs/appearance/ai-features', note: 'Google says normal SEO fundamentals still apply to AI Overviews and AI Mode.' },
          { name: 'Google: Organization structured data', href: 'https://developers.google.com/search/docs/appearance/structured-data/organization', note: 'Guidance on using organization information and sameAs links to clarify an entity.' },
          { name: 'IMDb: linking to official websites', href: 'https://help.imdb.com/article/contribution/submission-guides/linking-to-imdb-on-external-sites/GJ6MHXQ7AHEMZL2Q', note: 'IMDb supports official website links on person pages.' },
        ]} />
        <section className="wrap sec" style={{ paddingTop: 0 }}>
          <div className="close">
            <div className="circ"></div>
            <div className="in">
              <h2>Want a professional site under your own name?</h2>
              <p className="lead">Solta Site builds the actor website for you and puts it live on your own domain for $499 once.</p>
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
