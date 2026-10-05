export default function SectionContainer({ id, children, gap = 8, className = '' }) {
    return (
        <section
            id={id}
            className={`px-(--gutter) py-16 flex flex-col gap-(--section-gap) border-b border-border ${className}`}
            style={{ '--section-gap': `calc(var(--spacing) * ${gap})` }}
        >
            {children}
        </section>
    );
}