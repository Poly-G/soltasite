import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { MaterialsForm } from '@/components/materials/materials-form';
import { SiteHeader, SiteFooter } from '@/components/site-shell';
import { loadAuthorizedPaidOrder } from '@/lib/server/orders';
import { cormorant, interTight, rubik, workSans } from '@/lib/fonts';

export const metadata: Metadata = { title: 'Your materials', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function ThanksPage({ searchParams }: { searchParams: Promise<{ payment?: string; session_id?: string }> }) {
  if (process.env.SOLTASITE_COMMERCE_ENABLED !== 'true') redirect('/start');
  const params = await searchParams;
  let order;
  try { order = await loadAuthorizedPaidOrder(); }
  catch {
    return <><SiteHeader mode="simple" /><main id="main" className="wrap min-h-[60vh] py-20"><div className="form-head"><h1>Your materials form is temporarily unavailable.</h1><p className="lead">Please try your order link again shortly. If you need help, email <a href="mailto:contact@soltaworks.com" className="underline">contact@soltaworks.com</a>.</p></div></main><SiteFooter compact /></>;
  }
  if (!order) {
    if (params.payment === 'pending' && /^cs_(test|live)_[A-Za-z0-9]+$/.test(params.session_id ?? '')) {
      return <><SiteHeader mode="simple" /><main id="main" className="wrap min-h-[60vh] py-20"><div className="form-head"><div className="cap">Checking payment</div><h1>We’re confirming your order.</h1><p className="lead">Your materials form will open once the payment confirmation arrives. This can take a moment.</p><Link className="btn self-start" href={`/api/orders/access?session_id=${encodeURIComponent(params.session_id!)}`}>Check again <span aria-hidden="true">→</span></Link><p className="cap">If this continues, email <a className="underline" href="mailto:contact@soltaworks.com">contact@soltaworks.com</a>.</p></div></main><SiteFooter compact /></>;
    }
    if (params.session_id && /^cs_(test|live)_[A-Za-z0-9]+$/.test(params.session_id)) redirect(`/api/orders/access?session_id=${encodeURIComponent(params.session_id)}`);
    redirect('/start');
  }
  return <div className={`${cormorant.variable} ${interTight.variable} ${rubik.variable} ${workSans.variable}`}><SiteHeader mode="materials" /><main id="main" className="wrap pb-24 pt-[72px] max-[860px]:pb-12 max-[860px]:pt-9"><MaterialsForm orderId={order.id} customerName={order.name} /></main><SiteFooter compact /></div>;
}
