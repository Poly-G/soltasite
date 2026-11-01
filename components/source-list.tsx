type Source = {
  name: string;
  href: string;
  note?: string;
};

export function SourceList({ reviewed, sources }: { reviewed: string; sources: Source[] }) {
  return (
    <section className="wrap sec" style={{ paddingTop: 0 }}>
      <div style={{ maxWidth: '900px', borderTop: '1px solid var(--line)', paddingTop: '28px' }}>
        <div className="cap">Sources and review date</div>
        <p className="p" style={{ marginTop: '10px' }}>Reviewed {reviewed}. We use primary sources where possible and update this guide when the underlying guidance changes.</p>
        <ul className="p" style={{ paddingLeft: '20px', display: 'grid', gap: '10px', marginTop: '18px' }}>
          {sources.map((source) => (
            <li key={source.href}>
              <a href={source.href}>{source.name}</a>{source.note ? <>: {source.note}</> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
