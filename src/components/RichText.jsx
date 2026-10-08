import ReactMarkdown from "react-markdown";

export function RichText({ children }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ node, ...props }) => (
          <p className="text-muted-foreground leading-relaxed text-sm mb-4 last:mb-0" {...props} />
        ),
        ul: ({ node, ...props }) => <ul className="space-y-2 mb-4 last:mb-0" {...props} />,
        li: ({ node, children, ...props }) => (
          <li className="flex gap-3 text-sm text-muted-foreground leading-relaxed" {...props}>
            <span className="mt-2.5 h-px w-3 shrink-0 bg-border" />
            <span>{children}</span>
          </li>
        ),
        a: ({ node, ...props }) => (
          <a className="text-accent underline underline-offset-2" target="_blank" rel="noreferrer" {...props} />
        ),
        strong: ({ node, ...props }) => <strong className="font-medium text-foreground" {...props} />,
        img: ({ node, alt, ...props }) => (
          <img alt={alt ?? ""} loading="lazy" className="w-full bg-muted my-4 first:mt-0" {...props} />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}