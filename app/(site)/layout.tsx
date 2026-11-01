import { SiteMotion } from '@/components/site-motion';
import './solta.css';

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="solta-site"><a href="#main" className="skip-link">Skip to content</a>{children}<SiteMotion /></div>;
}
