import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MaterialsForm } from '@/components/materials/materials-form';
import { SiteHeader, SiteFooter } from '@/components/site-shell';
import { cormorant, interTight, rubik, workSans } from '@/lib/fonts';

export const metadata: Metadata = { title: 'Materials design preview', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function MaterialsPreviewPage() {
  if (process.env.SOLTASITE_DESIGN_PREVIEW !== 'true' || process.env.VERCEL_ENV === 'production') notFound();
  return <div className={`${cormorant.variable} ${interTight.variable} ${rubik.variable} ${workSans.variable}`}><SiteHeader mode="materials" /><main id="main" className="wrap pb-24 pt-[72px] max-[860px]:pb-12 max-[860px]:pt-9"><MaterialsForm orderId="00000000-0000-4000-8000-000000000001" preview /></main><SiteFooter compact /></div>;
}
