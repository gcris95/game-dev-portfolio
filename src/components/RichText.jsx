import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; 

function dedent(text) {
  const lines = text.split("\n");
  const rest = lines.slice(1).filter((l) => l.trim());
  const indent = Math.min(...rest.map((l) => l.match(/^ */)[0].length), Infinity);
  return [lines[0].trimStart(), ...lines.slice(1).map((l) => l.slice(Math.min(indent, l.length)))]
    .join("\n")
    .trim();
}

export function RichText({ children }) {
  const text = dedent(children);

  return (
    <ReactMarkdown
      rehypePlugins={[rehypeHighlight]}
      components={{
        p: ({ node, ...props }) => (
          <p className="text-muted-foreground leading-relaxed text-sm mb-4 last:mb-0" {...props} />
        ),
        ul: ({ node, ...props }) => <ul className="space-y-2 mb-4 last:mb-0" {...props} />,
        li: ({ node, children, ...props }) => (
          <li className="flex gap-3 text-sm text-muted-foreground leading-relaxed" {...props}>
            <span className="mt-2.5 h-px w-3 shrink-0 bg-muted-foreground" />
            <span>{children}</span>
          </li>
        ),
        a: ({ node, ...props }) => (
          <a className="text-accent underline underline-offset-2" target="_blank" rel="noreferrer" {...props} />
        ),
        strong: ({ node, ...props }) => <strong className="font-medium text-foreground" {...props} />,
        img: ({ node, alt, ...props }) => (
          <img alt={alt ?? ""} loading="lazy" className="block mx-auto w-full md:w-[75%] bg-muted my-4 first:mt-0" {...props} />
        ),
        pre: ({ node, ...props }) => (
          <pre
            className="my-4 max-w-full overflow-x-auto border border-border bg-muted p-4 text-xs leading-relaxed"
            {...props}
          />
        ),
        code: ({ node, className, children, ...props }) => {
          const isBlock = className || String(children).includes("\n");
          return isBlock ? (
            <code className={`font-mono text-foreground ${className ?? ""}`} {...props}>
              {children}
            </code>
          ) : (
            <code className="bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground" {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}