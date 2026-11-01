import Image from "next/image";
import Link from "next/link";
import { FaqList } from "@/components/faq-list";
import { KeshiaClientExample } from "@/components/examples/keshia-client-example";

export function HeroSection() {
 return (
<section className="wrap hero">
<div className="copy"><div className="eyebrow a a1">Actor websites · Built for you · Live in 5 business days</div>
<h1 className="a a2">What comes up when casting <span className="mark">Googles you?</span></h1>
<p className="lead a a3">Your headshot, reel and resume on your own name. Built for you by a person. $499, once.</p>
<div className="ctas a a4"><Link className="btn" href="/start">Start your site · $499 <span className="ar" aria-hidden="true">→</span></Link><a className="link" href="#examples">See one finished<span className="ar" aria-hidden="true">→</span></a></div>
<div className="cap a a5 desk">For actors with a rep, and actors looking for one. Reads on a phone in ten seconds.</div>
<div className="cap a a3 mob">Built for you by a person. Live in 5 business days.</div></div>
<div className="art" aria-hidden="true"><div className="circ"></div>
<div className="devwrap a a2"><div className="dev"><Image width={900} height={1348} sizes="(max-width: 860px) 85vw, 350px" preload src="/assets/img/keshia-jean.jpg" alt="" /><div className="in"><div className="nm">Keshia Jean</div><div className="mt">Film and TV · Los Angeles · Las Vegas</div><div className="reel"><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5v11l9-5.5z" fill="#fff"></path></svg> Watch reel · 1:40</div><div className="r"><span>Resume</span><span>PDF</span></div><div className="r"><span>Seeking representation</span><span>Contact form</span></div><div className="lk">IMDb · Actors Access · Instagram</div></div></div></div>
<div className="float g a4"><span><span style={{"fontSize": "12px", "color": "var(--grey)"}}>Google<br /><b>Keshia Jean, actor</b><small>keshiajean.com</small></span></span></div>
<div className="float dk rw a5"><span><span className="chk"><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.5l2.5 2.5 4.5-5" fill="none" stroke="#111318" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"></path></svg></span><span>Reel watched</span></span></div>
<div className="float af a6"><span><span className="chk"><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.5l2.5 2.5 4.5-5" fill="none" stroke="#111318" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"></path></svg></span><span>Agent form sent</span></span></div></div>
</section>
 );
}

export function WhySection() {
 return (
<section className="band"><div className="wrap sec why rv">
<h2>Casting looks you up. Here's what they find.</h2>
<div className="cols2"><div className="card pad today"><div className="cap t">Today</div><div className="item" style={{"color": "var(--grey)"}}>A profile in the same grey as the next 300.</div><div className="item" style={{"color": "var(--grey)"}}>An Instagram: your brunch, then maybe your reel.</div><div className="item" style={{"color": "var(--grey)"}}>A Google page that isn't about you.</div></div>
<div className="card pad dark"><div className="cap t">With your site</div><div className="item row"><span className="chk"><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.5l2.5 2.5 4.5-5" fill="none" stroke="#111318" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"></path></svg></span><span>Your headshot, as you look now.</span></div><div className="item row"><span className="chk"><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.5l2.5 2.5 4.5-5" fill="none" stroke="#111318" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"></path></svg></span><span>Your reel, one tap, on top.</span></div><div className="item row"><span className="chk"><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.5l2.5 2.5 4.5-5" fill="none" stroke="#111318" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"></path></svg></span><span>One link with your name on it, for anyone who asks.</span></div></div></div>
<p className="p mob" style={{"fontSize": "16px"}}>Without one: a profile like the next 300, a brunch Instagram, a Google page that isn't about you.</p>
<div className="after"><p className="lead">After a callback, someone Googles you. Your site is what they read.</p><Link className="btn" href="/start">Start your site · $499 <span className="ar" aria-hidden="true">→</span></Link></div></div></section>
 );
}

export function ExamplesSection() {
 return (
<section id="examples" className="wrap sec rv">
<div className="ex-head" style={{"paddingBottom": "48px"}}><h2>See what yours could look like.</h2><div className="cap">One real client site, plus two fictional design examples. Each starts with the same core materials and gets a different visual direction. <Link href="/actor-website-examples">Browse the full actor website examples guide →</Link></div></div>
<div className="examples"><article className="ex"><KeshiaClientExample compact /><div><div className="cap">Real client · Seeking representation</div><h3>Keshia Sophia Jean</h3><div className="cap">Independent film · Los Angeles and Las Vegas. Reel first, then headshots, resume and a meeting request for agents.</div><Link className="link" href="/actor-website-examples">See the full example<span className="ar" aria-hidden="true">→</span></Link></div></article><article className="ex"><div className="tile"><div className="mini" aria-hidden="true"><div className="bar"><i></i><i></i><i></i><span>mayaortiz.com</span></div><div className="shot" style={{"background": "#FFD84D", "color": "#fff", "fontFamily": "var(--font-work-sans),sans-serif"}}><Image width={1200} height={1800} sizes="(max-width: 860px) 85vw, 350px" src="/assets/img/maya-7.jpg" alt="" style={{"objectPosition": "50% 14%"}} /><div className="ov" style={{"background": "linear-gradient(180deg,rgba(0,0,0,0) 45%,rgba(0,0,0,.55) 100%)"}}></div><div style={{"position": "absolute", "left": "14px", "right": "14px", "top": "6px", "display": "flex", "justifyContent": "space-between", "alignItems": "center", "fontSize": "6px", "fontWeight": "600", "color": "#1A1A1A"}}><span style={{"fontFamily": "var(--font-rubik),sans-serif", "fontWeight": "800", "fontSize": "7px"}}>Maya Ortiz</span><span style={{"display": "flex", "gap": "6px", "alignItems": "center"}}><span>Reel</span><span>Credits</span><span>Photos</span><span style={{"background": "#1A1A1A", "color": "#fff", "borderRadius": "999px", "padding": "2px 4px", "fontFamily": "var(--font-rubik),sans-serif", "fontWeight": "700"}}>Book Maya</span></span></div><div style={{"position": "absolute", "left": "14px", "bottom": "12px"}}><div style={{"fontFamily": "var(--font-rubik),sans-serif", "fontWeight": "800", "fontSize": "28px", "lineHeight": ".9", "letterSpacing": "-0.03em"}}>Maya<br />Ortiz</div><div style={{"fontSize": "6px", "fontWeight": "600", "paddingTop": "5px"}}>Comedy and commercial actor in Los Angeles.</div><div style={{"display": "inline-block", "marginTop": "6px", "background": "#fff", "color": "#1A1A1A", "borderRadius": "999px", "padding": "3px 6px", "fontFamily": "var(--font-rubik),sans-serif", "fontWeight": "700", "fontSize": "6px"}}>▶ Watch the reel</div></div></div></div></div><div><h3>Comedy and commercial, with a rep</h3><div className="cap">Her face first, then the reel, credits and her agent.</div><Link className="link" href="/examples/maya">See the site<span className="ar" aria-hidden="true">→</span></Link></div></article><article className="ex"><div className="tile"><div className="mini" aria-hidden="true"><div className="bar"><i></i><i></i><i></i><span>devonhale.com</span></div><div className="shot" style={{"background": "#E9E6E1", "color": "#1F1E1B", "fontFamily": "var(--font-inter-tight),sans-serif"}}><Image width={1350} height={1800} sizes="(max-width: 860px) 85vw, 350px" src="/assets/img/devon-7.jpg" alt="" style={{"objectPosition": "50% 12%"}} /><div style={{"position": "absolute", "left": "14px", "right": "14px", "top": "7px", "display": "flex", "justifyContent": "space-between", "alignItems": "center", "fontSize": "6px"}}><span style={{"fontWeight": "600", "fontSize": "7px"}}>Devon Hale</span><span style={{"display": "flex", "gap": "7px"}}><span>Work</span><span>About</span><span>Reel</span><span>Headshots</span><span>Contact</span></span></div><div style={{"position": "absolute", "left": "12px", "right": "14px", "bottom": "12px"}}><div style={{"fontWeight": "500", "fontSize": "54px", "lineHeight": ".82", "letterSpacing": "-0.055em"}}>Devon Hale</div><div style={{"display": "flex", "justifyContent": "space-between", "alignItems": "flex-end", "paddingTop": "7px"}}><div style={{"fontSize": "6px", "lineHeight": "1.5"}}>Stage and screen · New York<br />Represented by Northgate Talent</div><span style={{"background": "#1F1E1B", "color": "#F4EDE0", "borderRadius": "999px", "padding": "3px 5px", "fontSize": "6px", "fontWeight": "500"}}>Watch the reel →</span></div></div></div></div></div><div><h3>Stage and screen, with a rep</h3><div className="cap">A big name over the photo, and credits laid out like a program.</div><Link className="link" href="/examples/devon">See the site<span className="ar" aria-hidden="true">→</span></Link></div></article></div>
<div className="ex-cta" style={{"paddingTop": "48px"}}><Link className="btn" href="/start">Start your site · $499 <span className="ar" aria-hidden="true">→</span></Link><span className="cap">Yours is live in 5 business days.</span></div></section>
 );
}

export function IncludesSection() {
 return (
<section className="wrap get rv"><div className="l"><h2>The five things casting looks at, in the order they look.</h2>
<div><div className="cap" style={{"fontWeight": "600", "paddingBottom": "8px"}}>On your site · <Link href="/what-to-put-on-an-actor-website">Full checklist →</Link></div><ol className="included-items" role="list"><li className="item numrow"><span className="num" aria-hidden="true">01</span><span>Your headshot, as you look now</span></li><li className="item numrow"><span className="num" aria-hidden="true">02</span><span>Your reel, one tap</span></li><li className="item numrow"><span className="num" aria-hidden="true">03</span><span>Your resume, downloadable</span></li><li className="item numrow"><span className="num" aria-hidden="true">04</span><span>Credits and training</span></li><li className="item numrow"><span className="num" aria-hidden="true">05</span><span>Your rep, or a form for agents to reach you</span></li></ol></div>
<div><div className="cap" style={{"fontWeight": "600", "paddingBottom": "8px"}}>You bring</div><div className="item" style={{"padding": "12px 0", "fontSize": "17px"}}>Headshots</div><div className="item" style={{"padding": "12px 0", "fontSize": "17px"}}>Reel link, or not yet</div><div className="item" style={{"padding": "12px 0", "fontSize": "17px"}}>Resume</div><div className="item" style={{"padding": "12px 0", "fontSize": "17px"}}>A domain, about $15 a year, in your name</div></div></div>
<div className="card price"><div><span className="pill">One-time</span></div><div className="disp">$499</div><p className="lead">You pay once, and the site is yours. There's no monthly fee.</p><div className="cap note">About one headshot session, and it lasts years.</div><Link className="btn full" href="/start">Start your site · $499 <span className="ar" aria-hidden="true">→</span></Link><Link className="link" href="/actor-website-cost">See the actor website cost breakdown <span className="ar" aria-hidden="true">→</span></Link></div></section>
 );
}

export function ProcessSection() {
 return (
<section className="band"><div className="wrap sec how rv"><h2>About 13 minutes of your time.</h2><div className="steps"><div className="step"><span className="num">01</span><h3>Pay $499</h3><div className="cap">3 minutes</div></div><div className="step"><span className="num">02</span><h3>Send us your stuff</h3><div className="cap">10 minutes</div></div><div className="step"><span className="num">03</span><h3>We build it</h3><div className="cap">3 business days</div></div><div className="step"><span className="num">04</span><h3>Two rounds of changes</h3><div className="cap">Included</div></div><div className="step"><span className="num">05</span><h3>Live on your domain</h3><div className="cap">Day 5</div></div></div><div className="cap desk">5 business days from the day we have your materials.</div></div></section>
 );
}

export function QuestionsSection() {
 return (
<section className="wrap sec rv" style={{"display": "flex", "flexDirection": "column", "gap": "36px"}}><h2>Questions</h2><FaqList /></section>
 );
}

export function ClosingSection() {
 return (
<section className="wrap rv" style={{"paddingBottom": "112px"}}><div className="close"><div className="circ"></div><div className="in"><h2>Be ready the next time casting looks you up.</h2>
<div className="ctas"><Link className="btn" href="/start">Start your site · $499 <span className="ar" aria-hidden="true">→</span></Link><a className="link" href="mailto:contact@soltaworks.com">Or email us<span className="ar" aria-hidden="true">→</span></a></div><div className="cap" style={{"fontSize": "16px"}}>contact@soltaworks.com · We reply within one business day</div></div></div></section>
 );
}

