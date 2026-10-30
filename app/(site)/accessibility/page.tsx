import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/site-shell";

export const metadata: Metadata = { title: "Accessibility", robots: { index: false, follow: false } };

export default function Page() {
 return <><SiteHeader mode="simple" /><main className="wrap min-h-[50vh]" style={{"paddingTop": "72px", "paddingBottom": "96px"}} id="main"><div style={{"maxWidth": "760px"}}><div className="form-head"><h1 className="text-[56px] max-[860px]:text-[40px] break-words">Accessibility</h1><p className="lead">Placeholder. Poly writes this page, starting from the matching page on soltaworks.com and adjusting it for the actor product (payments by Stripe, files held for the build, the two-round refund rule).</p></div><section style={{"padding": "28px 0", "borderTop": "1px solid var(--line)"}}><h3 style={{"paddingBottom": "8px"}}>Our standard</h3><p className="p">We build to WCAG 2.2 AA: keyboard access, visible focus, text contrast, captions where there is video.</p></section><section style={{"padding": "28px 0", "borderTop": "1px solid var(--line)"}}><h3 style={{"paddingBottom": "8px"}}>Something in the way?</h3><p className="p">Email contact@soltaworks.com and we fix it.</p></section></div></main><SiteFooter compact /></>;
}
