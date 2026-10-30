import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  path: "/terms",
  title: "Terms | Solta Site",
  description: "Terms for Solta Site actor website purchases, changes, refunds and ownership.",
});

export default function Page() {
 return <><SiteHeader mode="simple" /><main className="wrap min-h-[50vh]" style={{"paddingTop": "72px", "paddingBottom": "96px"}} id="main"><div style={{"maxWidth": "760px"}}><div className="form-head"><h1 className="text-[56px] max-[860px]:text-[40px] break-words">Terms</h1><p className="lead">Placeholder. Poly writes this page, starting from the matching page on soltaworks.com and adjusting it for the actor product (payments by Stripe, files held for the build, the two-round refund rule).</p></div><section style={{"padding": "28px 0", "borderTop": "1px solid var(--line)"}}><h3 style={{"paddingBottom": "8px"}}>What you buy</h3><p className="p">One actor website, built for you, as described on the page. $499, once.</p></section><section style={{"padding": "28px 0", "borderTop": "1px solid var(--line)"}}><h3 style={{"paddingBottom": "8px"}}>Changes and refunds</h3><p className="p">Two rounds of changes. If it is still not right after those, we refund you.</p></section><section style={{"padding": "28px 0", "borderTop": "1px solid var(--line)"}}><h3 style={{"paddingBottom": "8px"}}>Updates</h3><p className="p">Two updates a year included, then $29 each.</p></section><section style={{"padding": "28px 0", "borderTop": "1px solid var(--line)"}}><h3 style={{"paddingBottom": "8px"}}>Your domain and your site</h3><p className="p">Registered in your name. You own them.</p></section><section style={{"padding": "28px 0", "borderTop": "1px solid var(--line)"}}><h3 style={{"paddingBottom": "8px"}}>Your materials</h3><p className="p">You confirm you have the right to use the photos, reel and text you send.</p></section></div></main><SiteFooter compact /></>;
}
