import { SiteHeader, SiteFooter, StickyStart } from '@/components/site-shell';
import { HeroSection, WhySection, ExamplesSection, IncludesSection, ProcessSection, QuestionsSection, ClosingSection } from '@/components/landing-sections';
import { cormorant, interTight, jost, rubik, workSans } from '@/lib/fonts';

export default function HomePage() {
  return <div className={`has-sticky ${cormorant.variable} ${interTight.variable} ${jost.variable} ${rubik.variable} ${workSans.variable}`}><SiteHeader /><main id="main"><HeroSection /><WhySection /><ExamplesSection /><IncludesSection /><ProcessSection /><QuestionsSection /><ClosingSection /></main><SiteFooter /><StickyStart /></div>;
}
