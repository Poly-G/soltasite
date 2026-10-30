import Link from 'next/link';

export default function NotFound() {
  return <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-5 px-6 font-sans"><p className="text-sm text-soft-grey">Solta Site · 404</p><h1 className="font-heading text-5xl font-bold">That page isn’t here.</h1><p>Let’s get you back to the site.</p><Link className="w-fit rounded-xl bg-human-blue px-6 py-4 font-semibold text-white" href="/">Back to Solta</Link></main>;
}
